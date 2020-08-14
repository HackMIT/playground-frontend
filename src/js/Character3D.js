import * as THREE from 'three';

import AnimatedModel from './AnimatedModel';

class Character3D {
  constructor(name, initX, initY, parent, reverseRaycaster) {
    this.name = name;
    this.init_x = initX;
    this.init_y = initY;
    this.reverseRaycaster = reverseRaycaster;

    // load glb file
    parent.loader.load('Fox.glb', (gltf) => {
      gltf.scene.scale.set(0.04, 0.04, 0.04);
      this.setModel(parent, gltf.scene, gltf.animations[1], initX, initY);
    }, undefined, (e) => {
      console.log(e);
    });
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
    const walkCycle = mixer.clipAction(animation);
    walkCycle.enabled = false;
    walkCycle.play();

    parentScene.scene.add(model);

    this.model = new AnimatedModel(
      model, mixer, walkCycle,
      parentScene.worldVectorForPos(initX, initY), this.name, this.reverseRaycaster,
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

export default Character3D;
