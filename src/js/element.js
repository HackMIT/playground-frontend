import Editable from './editable';
import jukebox from '../jukebox';

const NO_ACTION = 0;
const JUKEBOX_OPEN_ACTION = 1;

class Element extends Editable {
  dataKeyName = 'element';

  deleteEventName = 'element_delete';

  updateEventName = 'element_update';

  get imagePath() {
    return `https://hackmit-playground-2020.s3.amazonaws.com/elements/${this.data.path}`;
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
    // eslint-disable-next-line
    elem.style.cursor = this.data.action === NO_ACTION ? 'default' : 'pointer';
  }

  configureImage(imgElem) {
    if (this.data.changingImagePath) {
      // TODO: Need to call clearInterval on this timer before getting rid of the element
      this.changingImageInterval = setInterval(() => {
        const pathOptions = this.data.changingPaths.split(',');

        this.data.path =
          pathOptions[Math.floor(Math.random() * pathOptions.length)];

        // eslint-disable-next-line
        imgElem.src = this.imagePath;
      }, this.data.changingInterval);
    }
  }

  onClick() {
    if (this.data.action === JUKEBOX_OPEN_ACTION) {
      jukebox.openJukeboxPane(document.body);
    }
  }

  onNameSelect(value) {
    this.data.path = value;
    this.sendUpdate(this.data);
  }
}

export default Element;
