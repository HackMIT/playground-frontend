import characterSelector from './components/characterSelector';
import createModal from '../modal';
import mapInstance from './components/worldMap';
import nonprofit from './components/nonprofit';

import Editable from './editable';
import jukebox from '../jukebox';
import socket from './socket';

// eslint-disable-next-line
import createElement from '../utils/jsxHelper';

const NO_ACTION = 0;
const JUKEBOX_OPEN_ACTION = 1;
const MAP_OPEN_ACTION = 2;
const WARDROBE_OPEN_ACTION = 3;
const NONPROFIT_OPEN_ACTION = 4;

class Element extends Editable {
  dataKeyName = 'element';

  deleteEventName = 'element_delete';

  updateEventName = 'element_update';

  get imagePath() {
    let { path } = this.data;

    if (this.data.toggleable) {
      path = this.data.path.split(',')[this.data.state];
    }

    return `https://hackmit-playground-2020.s3.amazonaws.com/elements/${path}`;
  }

  get name() {
    return this.data.path;
  }

  get width() {
    return this.data.width;
  }

  set width(newValue) {
    this.data.width = newValue;
  }

  remove() {
    super.remove();

    if (this.data.changingImagePath) {
      clearInterval(this.changingImageInterval);
    }
  }

  configureElement(elem) {
    if (this.data.action !== NO_ACTION || this.data.toggleable) {
      elem.style.cursor = 'pointer';
    } else {
      elem.style.cursor = 'default';
    }
  }

  configureImage(imgElem) {
    if (this.data.changingImagePath) {
      let state = 0;

      this.changingImageInterval = setInterval(() => {
        const pathOptions = this.data.changingPaths.split(',');

        if (this.data.changingRandomly) {
          this.data.path =
            pathOptions[Math.floor(Math.random() * pathOptions.length)];
        } else {
          if (state === pathOptions.length) {
            state = 0;
          }

          this.data.path = pathOptions[state];
          state += 1;
        }

        // eslint-disable-next-line
        imgElem.src = this.imagePath;
      }, this.data.changingInterval);
    }

    if (this.data.action !== NO_ACTION || this.data.toggleable) {
      imgElem.setAttribute('data-interactable', true);
    }
  }

  onClick() {
    if (this.data.toggleable) {
      socket.send({
        type: 'element_toggle',
        id: this.data.id,
      });
    } else if (this.data.action === JUKEBOX_OPEN_ACTION) {
      jukebox.openJukeboxPane(document.body);
    } else if (this.data.action === MAP_OPEN_ACTION) {
      const mapElem = <div className="modal-frame" id="map-frame" />;
      createModal(mapElem);

      mapInstance.createMap(this.characterId);
    } else if (this.data.action === WARDROBE_OPEN_ACTION) {
      createModal(characterSelector.createModal());
    } else if (this.data.action === NONPROFIT_OPEN_ACTION) {
      const nonprofitId = this.data.path
        .substring(this.data.path.indexOf('_') + 1)
        .split('.')[0];
      createModal(nonprofit.createNonprofitModal(nonprofitId));
    }
  }

  onNameSelect(value) {
    this.data.path = value;
    this.sendUpdate(this.data);
  }
}

export default Element;
