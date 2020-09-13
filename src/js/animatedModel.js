import * as THREE from 'three';
import LinearAnimation from './animations';
import '../styles/profile.scss';

class AnimatedModel {
  constructor(
    modelGeometry,
    mixer,
    animationCycles,
    walkCycleIndex,
    start,
    name,
    reverseRaycaster
  ) {
    this.modelGeometry = modelGeometry;
    this.animation = new LinearAnimation();
    this.mixer = mixer;
    this.animationCycles = animationCycles;
    this.walkCycleIndex = walkCycleIndex;
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

    this.gameDom.appendChild(this.nametag);

    this.trackingElems = [];

    this.addHtmlElem(this.nametag);
    this.addHtmlElem(this.chatBubble);
  }

  deconstruct() {
    this.trackingElems.forEach((elem) => {
      elem.remove();
    });

    this.nametag.remove();
    this.chatBubble.remove();

    this.animationCycles.forEach((cycle) => {
      cycle.enabled = false;
    });
  }

  // adds an html element that will follow the character around
  addHtmlElem(htmlElem) {
    const screenPt = this.reverseRaycaster(this.modelGeometry.position.clone());
    htmlElem.style.left = `${screenPt[0]}px`;
    htmlElem.style.top = `${screenPt[1]}px`;

    htmlElem.style.position = 'absolute';
    htmlElem.style.transitionTimingFunction = 'linear';
    htmlElem.style.transitionProperty = 'top, left';

    this.trackingElems.push(htmlElem);
  }

  getPosition() {
    const screenPt = this.reverseRaycaster(this.modelGeometry.position.clone());

    return {
      x: screenPt[0],
      y: screenPt[1],
    };
  }

  updateChat(msg) {
    if (this.chatTimer !== undefined) {
      clearTimeout(this.chatTimer);
    }

    this.chatBubble.innerHTML = msg;
    this.gameDom.appendChild(this.chatBubble);

    this.chatTimer = setTimeout(() => {
      this.chatBubble.remove();
    }, 5000);
  }

  setDanceAnimation(anim) {
    this.animating = true;
    this.animationCycles[anim].enabled = true;

    let duration = 0;

    switch (anim) {
      case 0: // dab
        duration = 330;
        break;
      default:
        break;
    }

    setTimeout(() => {
      this.animationCycles[anim].enabled = false;
      this.animating = false;
    }, duration);
  }

  setAnimation(dest, callback) {
    if (this.animation.destination && this.animation.destination.equals(dest)) {
      return 0;
    }

    this.animating = true;

    const time = this.animation.init(this.modelGeometry.position, dest);

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
    this.modelGeometry.setRotationFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      angle
    );

    this.animationCycles[this.walkCycleIndex].enabled = true;

    this.callback = callback;

    // move html elems tied to this model
    const objPt = dest.clone();
    const screenPt = this.reverseRaycaster(objPt);

    this.trackingElems.forEach((elem) => {
      elem.style.transitionDuration = `${time}s`;
      elem.style.left = `${screenPt[0]}px`;
      elem.style.top = `${screenPt[1]}px`;
    });

    return time;
  }

  update(timeDelta) {
    if (!this.animating) {
      return;
    }

    // position animation
    this.animation.update(timeDelta, this.modelGeometry.position);

    // internal animation (e.g. walking)
    this.mixer.update(timeDelta);

    if (this.animation.finished()) {
      this.animationCycles[this.walkCycleIndex].enabled = false;

      if (this.callback !== null) {
        this.animating = false;

        this.callback();
        this.callback = null;
      }
    }
  }
}

export default AnimatedModel;
