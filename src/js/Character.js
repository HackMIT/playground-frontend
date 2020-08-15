import * as THREE from 'three';

import AnimatedModel from './animatedModel';

class Character {
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

    this.elem.innerHTML = '<span class="name">' + character.name + '</span>';
        document.getElementById("game").appendChild(this.elem);

        this.profileElem = document.createElement("div"); //span to text
        this.profileElem.className = 'profile';
        this.elem.addEventListener('click', (e) => {
            this.profileElem.style.display = 'block';
        });
        this.elem.appendChild(this.profileElem);
        this.profileElem.style.display = 'none';

        this.yellowElem = document.createElement("div"); //span to text
        this.yellowElem.className = 'yellow-background';
        this.elem.addEventListener('click', (e) => {
            this.yellowElem.style.display = 'block';
        });
        this.elem.appendChild(this.yellowElem);
        this.yellowElem.style.display = 'none';

        this.whiteProfileElem = document.createElement("div"); 
        this.whiteProfileElem.className = 'profile-back';
        this.elem.addEventListener('click', (e) => {
            this.whiteProfileElem.style.display = 'block';
        });
        this.elem.appendChild(this.whiteProfileElem);
        this.whiteProfileElem.style.display = 'none';

        this.closeButton = document.createElement("div"); //span to text
        this.closeButton.className = 'close-button';
        this.closeButton.innerHTML = 'X';

        // document.getElementById("close-button").addEventListener('click', () => {
        //     console.log('here')
        //     this.profileElem.style.display = 'none';
        //     this.yellowElem.style.display = 'none';
        //     this.gradProfileElem.style.display = 'none';

        // })
        this.whiteProfileElem.appendChild(this.closeButton);
        //this.closeButton.style.display = 'none';

        this.gradProfileElem = document.createElement("div"); 
        this.gradProfileElem.className = 'profile-gradient';
        //this.gradProfileElem.innerHtml = 'This is a long long long bio. I have nothing to say but lets just fill it with as many words as I can. Yayy all filled.'
        this.elem.addEventListener('click', (e) => {
            this.gradProfileElem.style.display = 'block';
        });
        this.elem.appendChild(this.gradProfileElem);
        this.gradProfileElem.style.display = 'none';

        this.gradBioElem = document.createElement("div"); 
        this.gradBioElem.className = 'bio-gradient';
        this.elem.addEventListener('click', (e) => {
            this.gradBioElem.style.display = 'block';
        });
        this.elem.appendChild(this.gradBioElem);
        this.gradBioElem.style.display = 'none';

        this.bio = document.createElement("div"); 
        this.bio.className = 'bio-text';
        this.bio.innerHTML = 'This is a long long long bio. I have nothing to say but lets just fill it with as many words as I can. Yayy all filled.';
        this.gradBioElem.appendChild(this.bio);

        this.earth = document.createElement("div");
        this.earth.className = "earth";
        this.gradBioElem.appendChild(this.earth);

        // var c = document.getElementById("myCanvas");
        // console.log(c.getContext)
        // if (c.getContext) {
        //     var ctx = c.getContext("2d");
        //     ctx.beginPath();
        //     ctx.moveTo(0, 0);
        //     ctx.lineTo(300, 150);
        //     ctx.stroke();
        // }

        this.buttonContainer = document.createElement("div");
        this.buttonContainer.className = 'button-container';
        this.elem.addEventListener('click', (e) => {
            this.buttonContainer.style.display = 'block';
        });
        this.elem.appendChild(this.buttonContainer);
        this.buttonContainer.style.display = 'none';

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
        this.profile_name.innerHTML = character.name;

        this.school_name = document.createElement("div"); 
        this.school_name.className = 'sub-text';
        this.school_name.innerHTML = 'Massachusetts Institute of Tech';

        this.location_name = document.createElement("div"); 
        this.location_name.className = 'location-text';
        this.location_name.innerHTML = 'Arizona, United States';

        this.whiteProfileElem.appendChild(this.profile_name);
        this.whiteProfileElem.appendChild(this.school_name);
        this.gradProfileElem.appendChild(this.location_name)
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

export default Character;
