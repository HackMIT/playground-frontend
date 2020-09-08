import * as THREE from 'three';

import AnimatedModel from './animatedModel';
import characterManager from './managers/character';
import socket from './socket';

import addFriendIcon from '../images/icons/add-friend.svg';
import closeIcon from '../images/icons/close-white.svg';
import earthIcon from '../images/icons/earth.svg';
import flagIcon from '../images/icons/flag.svg';
import messageIcon from '../images/icons/message.svg';

// eslint-disable-next-line
import createElement from '../utils/jsxHelper';

class Character {
  constructor(data, parent, reverseRaycaster) {
    this.data = data;
    this.reverseRaycaster = reverseRaycaster;

    const scale = data.id === 'tim' ? 0.04 : 1.3;

    // load glb file
    parent.loader.load(
      data.id === 'tim' ? 'beaver.glb' : 'character.glb',
      (gltf) => {
        gltf.scene.scale.set(scale, scale, scale);
        this.setModel(
          parent,
          gltf.scene,
          gltf.animations[data.id === 'tim' ? 0 : 1],
          data.x,
          data.y
        );
      },
      undefined,
      (e) => {
        console.error(e);
      }
    );
  }

  update(deltaTime) {
    if (this.model !== undefined) {
      this.model.update(deltaTime);
    }
  }

  // returns time it'll take
  moveTo(vector, callback) {
    this.model.setAnimation(vector, callback);
  }

  safeDelete(parent) {
    this.model.deconstruct();
    parent.scene.remove(this.model.modelGeometry);
  }

  setModel(parentScene, model, animation, initX, initY) {
    const mixer = new THREE.AnimationMixer(model);
    mixer.timeScale = 2.5;
    const walkCycle = mixer.clipAction(animation);
    walkCycle.enabled = false;
    walkCycle.play();

    parentScene.scene.add(model);

    this.model = new AnimatedModel(
      model,
      mixer,
      walkCycle,
      parentScene.worldVectorForPos(initX, initY),
      this.data.name,
      this.reverseRaycaster
    );
  }

  hideProfile() {
    this.profileBox.style.visibility = 'hidden';
  }

  showProfile() {
    if (this.profileBox === undefined) {
      this.createCharacterProfile();
      this.gameDom = document.getElementById('game');
      this.gameDom.appendChild(this.profileBox);
      this.model.addHtmlElem(this.profileBox);
    }

    this.profileBox.style.visibility = 'inherit';
  }

  createCharacterProfile() {
    let buttons;

    if (this.data.id === characterManager.getCharacterId()) {
      buttons = <div />;
    } else if (characterManager.isFriend(this.data.id)) {
      buttons = (
        <div className="profile-buttons">
          <button>
            <img src={messageIcon} />
          </button>
          <button>
            <img src={flagIcon} />
          </button>
        </div>
      );
    } else {
      buttons = (
        <div className="profile-buttons">
          <button
            onclick={() => {
              socket.send({
                type: 'friend_request',
                recipientId: this.data.id,
              });
            }}
          >
            <img src={addFriendIcon} />
          </button>
          <button>
            <img src={flagIcon} />
          </button>
        </div>
      );
    }

    this.profileBox = (
      <div className="profile-container">
        <button className="close-button" onclick={() => this.hideProfile()}>
          <img src={closeIcon} />
        </button>
        <div className="profile-card">
          <h2 className="name">{this.data.name}</h2>
          <p className="school">{this.data.school}</p>
          <div className="profile-badge">
            <div />
            <div className="bio-background">
              <img className="earth" src={earthIcon} />
              <p className="bio">
                This is a long long bio, I have nothing to say but let's just
                fill it with as many words as I can.
              </p>
              <div className="line1" />
              <div className="location-container">
                <p className="location">Arizona, United States</p>
                <div className="line2" />
              </div>
            </div>
          </div>
        </div>
        {buttons}
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
}

export default Character;
