import * as THREE from 'three';
import LinearAnimation from './animations';

class AnimatedModel {
  constructor(modelGeometry, mixer, walkCycle, start, name, reverseRaycaster) {
    this.modelGeometry = modelGeometry;
    this.Animation = new LinearAnimation();
    this.mixer = mixer;
    this.walkCycle = walkCycle;
    this.reverseRaycaster = reverseRaycaster;

    modelGeometry.position.set(start.x, start.y, start.z);

    this.callback = null;

    this.gameDom = document.getElementById('game');

    // create html elems associated with this guy
    this.nametag = document.createElement('p');
    this.nametag.className = 'name';
    this.nametag.innerHTML = name;
    this.nametag.style.transform = 'translate(-50%, 25px)';

    this.chatBubble = document.createElement('div');
    this.chatBubble.className = 'text-bubble';
    this.chatBubble.innerHTML = '';
    this.chatBubble.style.transform = 'translate(-50%, -100px)';

    this.setupHTMLPosTrackingElem(this.nametag);
    this.setupHTMLPosTrackingElem(this.chatBubble);

    this.gameDom.appendChild(this.nametag);
  }

  deconstruct() {
    this.nametag.remove();
    this.chatBubble.remove();
    this.walkCycle.enabled = false;
  }

  setupHTMLPosTrackingElem(htmlElem) {
    const screenPt = this.reverseRaycaster(this.modelGeometry.position.clone());
    // eslint-disable-next-line
    htmlElem.style.left = `${screenPt[0]}px`;
    // eslint-disable-next-line
    htmlElem.style.top = `${screenPt[1]}px`;

    // eslint-disable-next-line
    htmlElem.style.position = 'absolute';
    // eslint-disable-next-line
    htmlElem.style.transitionTimingFunction = 'linear';
    // eslint-disable-next-line
    htmlElem.style.transitionProperty = 'top, left';
  }

  updateHtml() {
    // NOTE TO ZOEY: these two first were from previous 2d
    // where character was elem and its id was "game"

    // this.elem.innerHTML = `<span class="name">${name}</span>`;
    // document.getElementById("game").appendChild(this.elem);
    this.profileElem = document.createElement("div"); // span to text
    this.profileElem.className = 'profile';
    this.elem.addEventListener('click', () => {
        this.profileElem.style.display = 'block';
    });
    this.elem.appendChild(this.profileElem);
    this.profileElem.style.display = 'none';
    this.setupHTMLPosTrackingElem(this.profileElem);

    this.yellowElem = document.createElement("div"); // span to text
    this.yellowElem.className = 'yellow-background';
    this.elem.addEventListener('click', () => {
        this.yellowElem.style.display = 'block';
    });
    this.elem.appendChild(this.yellowElem);
    this.yellowElem.style.display = 'none';

    this.whiteProfileElem = document.createElement("div"); 
    this.whiteProfileElem.className = 'profile-back';
    this.elem.addEventListener('click', () => {
        this.whiteProfileElem.style.display = 'block';
    });
    this.elem.appendChild(this.whiteProfileElem);
    this.whiteProfileElem.style.display = 'none';

    this.closeButton = document.createElement("div"); // span to text
    this.closeButton.className = 'close-button';
    this.closeButton.innerHTML = 'X';

    // Note to ZOE: this is where i'm slightly confused
    // the event listeners are not working
    document.getElementById("close-button").addEventListener('click', () => {
        this.profileElem.style.display = 'none';
        this.yellowElem.style.display = 'none';
        this.gradProfileElem.style.display = 'none';

     })
    this.whiteProfileElem.appendChild(this.closeButton);
    this.closeButton.style.display = 'none';

    this.gradProfileElem = document.createElement("div"); 
    this.gradProfileElem.className = 'profile-gradient';
    this.gradProfileElem.innerHtml = 'This is a long long long bio. I have nothing to say but lets just fill it with as many words as I can. Yayy all filled.'
    this.elem.addEventListener('click', () => {
        this.gradProfileElem.style.display = 'block';
    });
    this.elem.appendChild(this.gradProfileElem);
    this.gradProfileElem.style.display = 'none';

    this.gradBioElem = document.createElement("div"); 
    this.gradBioElem.className = 'bio-gradient';
    this.elem.addEventListener('click', () => {
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

    this.buttonContainer = document.createElement("div");
    this.buttonContainer.className = 'button-container';
    this.elem.addEventListener('click', () => {
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
    // NOTE TO ZOE: im not sure how to get the name 
    // of the animated model from this file 
    // so maybe this method should belong in character.js
    // however i saw the document.appendChilds in this file
    // so decided to add the code here
    // this.profile_name.innerHTML = name;

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

  updateChat(msg) {
    this.chatBubble.innerHTML = msg;
    this.gameDom.appendChild(this.chatBubble);

    setTimeout(() => {
      this.chatBubble.remove();
    }, 5000);
  }

  setAnimation(dest, callback) {
    if (this.Animation.destination && this.Animation.destination.equals(dest)) { return 0; }
    const time = this.Animation.init(this.modelGeometry.position, dest);

    // update roation (by finding vector we're traveling along, setting angle to that)
    const bearing = dest.clone();
    bearing.addScaledVector(this.modelGeometry.position, -1);

    // angle between the cur direction and the z axis
    let angle = bearing.angleTo(new THREE.Vector3(0, 0, 1));

    // determine sign of angle (note that this changes the bearing vector)
    bearing.cross(new THREE.Vector3(0, 0, 1));
    const dirCross = -bearing.y;
    angle *= dirCross / Math.abs(dirCross);

    // rotate around Y axis
    this.modelGeometry.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    this.walkCycle.enabled = true;

    this.callback = callback;

    // move nametag/chatbubble
    const objPt = dest.clone();
    const screenPt = this.reverseRaycaster(objPt);

    this.nametag.style.transitionDuration = `${time}s`;
    this.nametag.style.left = `${screenPt[0]}px`;
    this.nametag.style.top = `${screenPt[1]}px`;

    this.chatBubble.style.transitionDuration = `${time}s`;
    this.chatBubble.style.left = `${screenPt[0]}px`;
    this.chatBubble.style.top = `${screenPt[1]}px`;

    return time;
  }

  update(timeDelta) {
    // position animation
    this.Animation.update(timeDelta, this.modelGeometry.position);

    // internal animation (e.g. walking)
    this.mixer.update(timeDelta);

    if (this.Animation.finished()) {
      this.walkCycle.enabled = false;

      if (this.callback !== null) {
        this.callback();
        this.callback = null;
      }
    }
  }
}

export default AnimatedModel;
