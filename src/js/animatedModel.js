import * as THREE from 'three';

import LinearAnimation from './animations';
import constants from '../constants';
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
    this.nametag.innerText = name;
    this.nametag.style.transform = 'translate(-50%, 25px)';

    this.chatBubble = document.createElement('div');
    this.chatBubble.className = 'text-bubble';
    this.chatBubble.innerText = '';

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

  // behind is false in like just nightclub and maybe the auditorium
  changeZorderOfNameTag(behind) {
    this.nametag.style.zIndex = behind ? -1 : 0;
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

    this.chatBubble.innerText = msg;
    this.gameDom.appendChild(this.chatBubble);

    const wpm = 180;
    const words = msg.length / 5;
    const wordsTime = (words / wpm) * 60 * 1000;
    const timeout = wordsTime + 5000;

    this.chatTimer = setTimeout(() => {
      this.chatBubble.remove();
    }, timeout);
  }

  setDanceAnimation(anim) {
    // Allow an animation interrupt if we're flossing
    if (
      this.animating &&
      !(
        this.animationCycles[constants.dances.floss].enabled ||
        this.animationCycles[constants.dances.shoot].enabled
      )
    ) {
      return;
    }

    // Disable other animations
    this.animationCycles.forEach((cycle) => {
      cycle.reset();
      cycle.enabled = false;
    });

    this.animating = true;
    this.animationCycles[anim].enabled = true;

    let duration = 0;

    switch (anim) {
      case constants.dances.dab:
        duration = 500;
        break;
      case constants.dances.wave:
        duration = 1000;
        break;
      case constants.dances.backflip:
        duration = 1000;
        break;
      case constants.dances.clap:
        duration = 1100;
        break;
      default:
        break;
    }

    if (duration === 0) {
      return;
    }

    this.animationTimeout = setTimeout(() => {
      this.animating = false;
      this.animationCycles[anim].reset();
    }, duration);
  }

  setAnimation(dest, callback) {
    if (this.animation.destination && this.animation.destination.equals(dest)) {
      return 0;
    }

    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = undefined;
    }

    this.animationCycles.forEach((cycle) => {
      cycle.reset();
      cycle.enabled = false;
    });

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
