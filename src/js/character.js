import * as THREE from 'three';

import AnimatedModel from './animatedModel';

class Character {
  constructor(name, initX, initY, parent, reverseRaycaster) {
    this.name = name;
    this.curX = initX;
    this.curY = initY;
    this.reverseRaycaster = reverseRaycaster;

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
  // x and y are just stored so the screen position doesn't have to be recalculated
  moveTo(vector, callback, x, y) {
    this.model.setAnimation(vector, callback);
    this.curX = x
    this.curY = y
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
