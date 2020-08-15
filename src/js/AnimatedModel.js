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
