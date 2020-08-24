import * as THREE from 'three';

import AnimatedModel from './animatedModel';

class Character {
  constructor(name, initX, initY, parent, reverseRaycaster) {
    this.name = name;
    this.init_x = initX;
    this.init_y = initY;
    this.reverseRaycaster = reverseRaycaster;

    this.createCharacterProfile();
    this.gameDom = document.getElementById('game');
    this.gameDom.appendChild(this.profileBox);

    this.showProfile();

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

    this.model.addHtmlElem(this.profileBox)
  }

  showProfile() {
    this.profileBox.style.display = 'block';
  }


  createCharacterProfile() {
    this.profileBox = document.createElement("div")
    this.profileBox.style.display = 'none';


    this.profileElem = document.createElement("div"); // span to text
    this.profileElem.className = 'profile';
    this.profileBox.appendChild(this.profileElem);
    this.profileElem.style.display = 'block';

    this.yellowElem = document.createElement("div"); // span to text
    this.yellowElem.className = 'yellow-background';
    this.yellowElem.style.display = 'block';
    this.profileBox.appendChild(this.yellowElem);

    this.whiteProfileElem = document.createElement("div"); 
    this.whiteProfileElem.className = 'profile-back';
    this.profileBox.appendChild(this.whiteProfileElem);
    this.whiteProfileElem.style.display = 'block';

    this.closeButton = document.createElement("div"); // span to text
    this.closeButton.className = 'close-button';
    this.closeButton.innerHTML = 'X';

    this.closeButton.addEventListener('click', () => {
      this.profileBox.style.display = 'none';
    })
    this.whiteProfileElem.appendChild(this.closeButton);
    this.closeButton.style.display = 'block';

    this.gradProfileElem = document.createElement("div"); 
    this.gradProfileElem.className = 'profile-gradient';
    this.gradProfileElem.innerHtml = 'This is a long long long bio. I have nothing to say but lets just fill it with as many words as I can. Yayy all filled.'
    this.profileBox.appendChild(this.gradProfileElem);
    this.gradProfileElem.style.display = 'block';

    this.gradBioElem = document.createElement("div"); 
    this.gradBioElem.className = 'bio-gradient';
    this.profileBox.appendChild(this.gradBioElem);
    this.gradBioElem.style.display = 'profileBox';

    this.bio = document.createElement("div"); 
    this.bio.className = 'bio-text';
    this.bio.innerHTML = 'This is a long long long bio. I have nothing to say but lets just fill it with as many words as I can. Yayy all filled.';
    this.gradBioElem.appendChild(this.bio);

    this.earth = document.createElement("div");
    this.earth.className = "earth";
    this.gradBioElem.appendChild(this.earth);

    this.buttonContainer = document.createElement("div");
    this.buttonContainer.className = 'button-container';
    this.profileBox.appendChild(this.buttonContainer);
    this.buttonContainer.style.display = 'block';

    this.buttons1 = document.createElement("div"); 
    this.buttons1.className = 'profile-button';

    this.buttons2 = document.createElement("div"); 
    this.buttons2.className = 'profile-button';

    this.buttons3 = document.createElement("div"); 
    this.buttons3.className = 'profile-button';

    this.buttons4 = document.createElement("div"); 
    this.buttons4.className = 'profile-button';

    this.buttons5 = document.createElement("div"); 
    this.buttons5.className = 'profile-button';

    this.buttonContainer.appendChild(this.buttons1);
    this.buttonContainer.appendChild(this.buttons2);
    this.buttonContainer.appendChild(this.buttons3);
    this.buttonContainer.appendChild(this.buttons4);
    this.buttonContainer.appendChild(this.buttons5);

    this.profile_name = document.createElement("div"); 
    this.profile_name.className = 'profile-text';
    this.profile_name.innerHTML = this.name;

    this.school_name = document.createElement("div"); 
    this.school_name.className = 'sub-text';
    this.school_name.innerHTML = 'Massachusetts Institute of Tech';

    this.location_name = document.createElement("div"); 
    this.location_name.className = 'location-text';
    this.location_name.innerHTML = 'Arizona, United States';

    this.whiteProfileElem.appendChild(this.profile_name);
    this.whiteProfileElem.appendChild(this.school_name);
    this.gradProfileElem.appendChild(this.location_name);
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
