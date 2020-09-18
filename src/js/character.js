import * as THREE from 'three';

import AnimatedModel from './animatedModel';
import achievements from './components/achievements';
import characterManager from './managers/character';
import createModal from '../modal';
import constants from '../constants';
import socket from './socket';
import report from './components/report';

import addFriendIcon from '../images/icons/add-friend.svg';
import closeIcon from '../images/icons/close-white.svg';
import earthIcon from '../images/icons/earth.svg';
import flagIcon from '../images/icons/flag.svg';
import messageIcon from '../images/icons/message.svg';
import starIcon from '../images/icons/star.svg';

// eslint-disable-next-line
import createElement from '../utils/jsxHelper';

class Character {
  constructor(data, parent, reverseRaycaster) {
    this.data = data;
    this.reverseRaycaster = reverseRaycaster;

    const onModelLoadSuccess = (gltf) => {
      const scale = data.id === 'tim' ? 0.04 : 1.3;
      gltf.scene.scale.set(scale, scale, scale);
      this.setModel(
        parent,
        gltf.scene,
        gltf.animations,
        data.id === 'tim' ? 0 : constants.dances.walk,
        data.x,
        data.y
      );
    };

    if (data.id === 'tim') {
      parent.loader.load(
        'models/beaver.glb',
        onModelLoadSuccess,
        undefined,
        (err) => {
          console.error(err);
        }
      );
    } else {
      const req = new XMLHttpRequest();
      req.open('GET', 'models/character.gltf', true);
      req.onload = () => {
        const gltfData = JSON.parse(req.response);

        const matColors = {
          Head: this.getColor(data.skinColor),
          Face: this.getColor(data.eyeColor),
          Shirt: this.getColor(data.shirtColor),
          Skin: this.getColor(data.pantsColor),
        };

        gltfData.materials = gltfData.materials.map((mat) => {
          if (Object.keys(matColors).includes(mat.name)) {
            mat.pbrMetallicRoughness.baseColorFactor = matColors[
              mat.name
            ].concat(
              // add 1 to array for alpha channel
              1
            );
          }

          return mat;
        });

        parent.loader.parse(
          JSON.stringify(gltfData),
          'models/',
          onModelLoadSuccess,
          undefined,
          (err) => {
            console.error(err);
          }
        );
      };

      req.send();
    }

    socket.subscribe('achievements', this.handleSocketMessage);
  }

  handleSocketMessage = (msg) => {
    if (msg.id !== this.data.id || msg.type !== 'achievements') {
      return;
    }

    // Create achievements modal here
    createModal(achievements.createAchievementsModal(msg.achievements));
  };

  getColor = (hex) => {
    return hex
      .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`
      )
      .substring(1)
      .match(/.{2}/g)
      .map((x) => parseInt(x, 16) / 255);
  };

  update(deltaTime) {
    if (this.model !== undefined) {
      this.model.update(deltaTime);
    }
  }

  dance(dance) {
    this.model.setDanceAnimation(dance);
  }

  // returns time it'll take
  moveTo(vector, callback) {
    this.model.setAnimation(vector, callback);
  }

  safeDelete(parent) {
    this.model.deconstruct();
    parent.scene.remove(this.model.modelGeometry);
  }

  setModel(parentScene, model, actions, walkActionIndex, initX, initY) {
    const mixer = new THREE.AnimationMixer(model);
    mixer.timeScale = 2.5;

    const animationCycles = actions.map((x, i) => {
      const cycle = mixer.clipAction(x);

      if (i === constants.dances.dab) {
        cycle.clampWhenFinished = true;
        cycle.repetitions = 1;
      } else if (i === constants.dances.floss) {
        cycle.timeScale = 0.3;
      } else if (i === constants.dances.wave) {
        cycle.timeScale = 0.4;
        cycle.clampWhenFinished = true;
        cycle.repetitions = 1;
      }

      cycle.enabled = false;
      cycle.play();
      return cycle;
    });

    parentScene.scene.add(model);

    this.model = new AnimatedModel(
      model,
      mixer,
      animationCycles,
      walkActionIndex,
      parentScene.worldVectorForPos(initX, initY),
      this.data.name,
      this.reverseRaycaster
    );
  }

  hideProfile() {
    this.profileBox.style.visibility = 'hidden';
  }

  showProfile() {
    if (
      this.profileBox !== undefined &&
      this.profileBox.style.visibility === 'inherit'
    ) {
      // If clicking on an already open character, just close theirs and exit
      this.profileBox.style.visibility = 'hidden';
      return;
    }

    Array.from(document.getElementsByClassName('profile-container')).forEach(
      (elem) => {
        elem.style.visibility = 'hidden';
      }
    );

    if (this.profileBox === undefined) {
      this.createCharacterProfile();

      this.gameDom = document.getElementById('game');
      this.gameDom.appendChild(this.profileBox);
    }

    let { x, y } = this.model.getPosition();
    x = Math.min(
      Math.max(x, 200),
      this.gameDom.getBoundingClientRect().width - 200
    );
    y = Math.max(y, 400);

    this.profileBox.style.left = `${x}px`;
    this.profileBox.style.top = `${y}px`;
    this.profileBox.style.visibility = 'inherit';
  }

  createCharacterProfile() {
    const none = <div style="display: none" />;

    const buttons = (
      <div id="profile-buttons" className="profile-buttons">
        {' '}
        {characterManager.isFriend(this.data.id) ? (
          <button>
            <img src={messageIcon} />{' '}
          </button>
        ) : (
          none
        )}{' '}
        {characterManager.isFriend(this.data.id) ||
        characterManager.getCharacterId() === this.data.id ? (
          none
        ) : (
          <button
            onclick={() => {
              socket.send({
                type: 'friend_request',
                recipientId: this.data.id,
              });
            }}
          >
            <img src={addFriendIcon} />{' '}
          </button>
        )}{' '}
        <button
          onclick={() => {
            socket.send({
              type: 'get_achievements',
              id: this.data.id,
            });
          }}
        >
          <img src={starIcon} />{' '}
        </button>{' '}
        {this.data.id === characterManager.getCharacterId() ? (
          none
        ) : (
          <button
            id="report-button"
            onclick={() => {
              this.handleReportButton();
            }}
          >
            <img src={flagIcon} />{' '}
          </button>
        )}{' '}
      </div>
    );

    this.profileBox = (
      <div className="profile-container">
        <button className="close-button" onclick={() => this.hideProfile()}>
          <img src={closeIcon} />{' '}
        </button>{' '}
        <div className="profile-card">
          <h2 className="name"> {this.data.name} </h2>{' '}
          <p className="school"> {this.data.school} </p>{' '}
          <div className="profile-badge">
            <div />
            <div className="bio-background">
              <img className="earth" src={earthIcon} />{' '}
              <p className="bio">
                {this.data.bio.length === 0
                  ? "This person hasn't added their bio yet!"
                  : this.data.bio}
              </p>
              <div className="line1" />
              <div className="location-container">
                <p className="location">
                  {this.data.location.length === 0
                    ? 'Earth'
                    : this.data.location}
                </p>
                <div className="line2" />
              </div>
            </div>
          </div>
        </div>
        {this.data.id === 'tim' ? null : buttons}
      </div>
    );
  }

  // say msg, return name
  sendChat(msg) {
    if (this.model !== undefined) {
      this.model.updateChat(msg);
    }

    return this.data.name;
  }

  handleReportButton = () => {
    if (this.reportPaneVisible === true) {
      // Hide the pane
      document.getElementById('report-pane').classList.add('invisible');
      this.reportPaneVisible = false;
    } else if (this.reportPaneVisible === false) {
      // make the pane visible
      document.getElementById('report-pane').classList.remove('invisible');
      this.reportPaneVisible = true;
    } else {
      // create it now
      document
        .getElementById('profile-buttons')
        .appendChild(report.createReportPane());
      this.reportPaneVisible = true;
    }
    document.getElementById('reported-id').value = this.data.id;
  };
}

export default Character;
