import * as THREE from 'three';

import AnimatedModel from './animatedModel';
import closeIcon from '../images/icons/close-white.svg';

// eslint-disable-next-line
import createElement from '../utils/jsxHelper';

class Character {
  constructor(name, initX, initY, parent, reverseRaycaster) {
    this.name = name;
    this.init_x = initX;
    this.init_y = initY;
    this.reverseRaycaster = reverseRaycaster;

    this.createCharacterProfile();
    this.gameDom = document.getElementById('game');
    this.gameDom.appendChild(this.profileBox);

    // load glb file
    parent.loader.load(
      'character.glb',
      (gltf) => {
        gltf.scene.scale.set(0.65, 0.65, 0.65);
        this.setModel(parent, gltf.scene, gltf.animations[0], initX, initY);
      },
      undefined,
      (e) => {
        console.log(e);
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
      this.name,
      this.reverseRaycaster
    );

    this.model.addHtmlElem(this.profileBox);
  }

  hideProfile() {
    this.profileBox.style.visibility = 'hidden';
  }

  showProfile() {
    this.profileBox.style.visibility = 'inherit';
  }

  createCharacterProfile() {
    this.profileBox = (
      <div className="profile-container">
        <button className="close-button" onclick={() => this.hideProfile()}>
          <img src={closeIcon} />
        </button>
        <div className="profile-card">
          <h2 className="name">Savannah Liu</h2>
          <p className="school">Massachusetts Institute of Technology</p>
          <div className="profile-badge">
            <div />
            <div className="bio-background">
              <p className="bio">
                This is a long long bio, I have nothing to say but let's just
                fill it with as many words as I can.
              </p>
            </div>
          </div>
        </div>
        <div className="profile-buttons">
          <button>
            <img src={closeIcon} />
          </button>
          <button>
            <img src={closeIcon} />
          </button>
          <button>
            <img src={closeIcon} />
          </button>
        </div>
      </div>
    );
  }

  // say msg, return name
  sendChat(msg) {
    if (this.model !== undefined) {
      this.model.updateChat(msg);
    }

    return this.name;
  }
}

export default Character;
