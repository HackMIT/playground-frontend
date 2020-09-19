import arcade from './components/arcade';
import characterSelector from './components/characterSelector';
import createModal from '../modal';
import mapInstance from './components/worldMap';
import misti from './components/misti';
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
const MISTI_POPUP_ACTION = 5;
const CEREMONY_OPEN_ACTION = 6;
const ARCADE_POPUP_ACTION = 7;

class Element extends Editable {
  dataKeyName = 'element';

  deleteEventName = 'element_delete';

  updateEventName = 'element_update';

  get imagePath() {
    let { path } = this.data;

    if (this.data.toggleable) {
      path = this.data.path.split(',')[this.data.state];
    }

    return `https://hackmit-playground-2020.s3.amazonaws.com/elements/${path}?${Math.random()}`;
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

  hasAction() {
    return this.data.action !== NO_ACTION || this.data.toggleable;
  }

  configureElement(elem) {
    if (this.hasAction()) {
      elem.style.cursor = 'pointer';
    } else {
      elem.style.cursor = 'default';
    }
  }

  setImageForState() {
    const pathOptions = this.data.changingPaths.split(',');
    this.data.path = pathOptions[this.data.state];
  }

  configureImage(imgElem) {
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
      createModal(characterSelector.createModal(), 'character');
    } else if (this.data.action === NONPROFIT_OPEN_ACTION) {
      const nonprofitId = this.data.path
        .substring(this.data.path.indexOf('_') + 1)
        .split('.')[0];
      createModal(nonprofit.createNonprofitModal(nonprofitId));
    } else if (this.data.action === MISTI_POPUP_ACTION) {
      createModal(misti.createModal());
    } else if (this.data.action === CEREMONY_OPEN_ACTION) {
      window.open('https://go.hackmit.org/opening', '_blank');
    } else if (this.data.action === ARCADE_POPUP_ACTION) {
      createModal(arcade.createArcadePanel());
    }
  }

  onNameSelect(value) {
    this.data.path = value;
    this.sendUpdate(this.data);
  }
}

export default Element;
