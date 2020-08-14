import socket from './socket';
import deleteIcon from '../images/icons/delete.svg';

class Editable {
  constructor(data, id, elementNames) {
    this.editable = false;
    this.editing = false;
    this.data = data;
    this.id = id;

    this.element = this.createElement(elementNames);
  }

  set visible(newValue) {
    if (newValue) {
      this.element.classList.remove('invisible');
    } else {
      this.element.classList.add('invisible');
    }
  }

  remove() {
    this.element.remove();
    // TODO: Remove click listeners and stuff
  }

  createElement(elementNames) {
    const elementElem = document.createElement('div');
    elementElem.classList.add('element');
    elementElem.style.left = `${this.data.x * 100}%`;
    elementElem.style.top = `${this.data.y * 100}%`;
    elementElem.style.width = `${this.width * 100}%`;

    const imgElem = document.createElement('img');
    imgElem.classList.add('element-img');
    imgElem.setAttribute('src', this.imagePath);
    elementElem.appendChild(imgElem);

    const deleteButton = document.createElement('div');
    deleteButton.classList.add('delete');
    elementElem.appendChild(deleteButton);

    const deleteButtonImg = document.createElement('img');
    deleteButtonImg.setAttribute('src', deleteIcon);
    deleteButton.appendChild(deleteButtonImg);

    deleteButton.onclick = () => {
      this.sendDelete();
    };

    const pathSelect = document.createElement('select');

    for (let i = 0; i < elementNames.length; i += 1) {
      const optionElem = document.createElement('option');
      optionElem.value = elementNames[i];
      [optionElem.text] = elementNames[i].split('.');
      pathSelect.appendChild(optionElem);
    }

    pathSelect.value = this.name;

    pathSelect.onchange = () => {
      this.onNameSelect(pathSelect.value);
    };

    elementElem.appendChild(pathSelect);

    const brResizeElem = document.createElement('div');
    brResizeElem.classList.add('resizer');
    brResizeElem.classList.add('bottom-right');
    elementElem.appendChild(brResizeElem);

    brResizeElem.onmousedown = (e) => {
      const outerRect = document.getElementById('outer').getBoundingClientRect();

      const startRect = elementElem.getBoundingClientRect();
      const startX = (elementElem.getBoundingClientRect().left - outerRect.left)
          + elementElem.getBoundingClientRect().width / 2;
      const startY = (elementElem.getBoundingClientRect().top - outerRect.top)
          + elementElem.getBoundingClientRect().height / 2;

      const shiftX = (elementElem.getBoundingClientRect().left - outerRect.left)
          + elementElem.getBoundingClientRect().width - (e.clientX - outerRect.left);
      const shiftY = (elementElem.getBoundingClientRect().top - outerRect.top)
          + elementElem.getBoundingClientRect().height - (e.clientY - outerRect.top);

      function resizeAt(x, y) {
        const pageX = x - outerRect.left;
        const pageY = y - outerRect.top;

        const newWidthX = pageX + shiftX - (startRect.left - outerRect.left);

        const newHeight = pageY + shiftY - (startRect.top - outerRect.top);
        const newWidthY = newHeight * (startRect.width / startRect.height);

        const newWidth = newWidthX > newWidthY ? newWidthX : newWidthY;

        elementElem.style.top = `${((startY + (newWidth * (startRect.height / startRect.width) - startRect.height) / 2) / outerRect.height) * 100}%`;
        elementElem.style.left = `${((startX + (newWidth - startRect.width) / 2) / outerRect.width) * 100}%`;
        elementElem.style.width = `${((newWidth - 4) / outerRect.width) * 100}%`;
      }

      resizeAt(e.pageX, e.pageY);

      const onMouseMove = (evt) => {
        resizeAt(evt.pageX, evt.pageY);
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        this.data.x = parseFloat(
          elementElem.style.left.substring(0, elementElem.style.left.length - 2),
        ) / 100;
        this.data.y = parseFloat(
          elementElem.style.top.substring(0, elementElem.style.top.length - 2),
        ) / 100;
        this.width = parseFloat(
          elementElem.style.width.substring(0, elementElem.style.width.length - 2),
        ) / 100;

        this.sendUpdate();
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    brResizeElem.ondragstart = () => false;

    elementElem.onmousedown = (e) => {
      if (!this.editable) {
        return;
      }

      if (!e.target.classList.contains('element-img')) {
        return;
      }

      this.editing = true;
      elementElem.classList.add('editing');
      elementElem.classList.add('moving');

      const outerRect = document.getElementById('outer').getBoundingClientRect();

      const shiftX = (e.pageX - outerRect.left)
        - (elementElem.getBoundingClientRect().left - outerRect.left)
        - elementElem.getBoundingClientRect().width / 2;

      const shiftY = (e.pageY - outerRect.top)
        - (elementElem.getBoundingClientRect().top - outerRect.top)
        - elementElem.getBoundingClientRect().height / 2;

      const moveAt = (x, y) => {
        const pageX = x - outerRect.left;
        const pageY = y - outerRect.top;

        elementElem.style.left = `${((pageX - shiftX) / outerRect.width) * 100}%`;
        elementElem.style.top = `${((pageY - shiftY) / outerRect.height) * 100}%`;
      };

      moveAt(e.pageX, e.pageY);

      const onMouseMove = (evt) => {
        moveAt(evt.pageX, evt.pageY);
      };

      const onMouseUp = () => {
        elementElem.classList.remove('moving');

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        elementElem.onmouseup = null;

        this.data.x = parseFloat(
          elementElem.style.left.substring(0, elementElem.style.left.length - 2),
        ) / 100;
        this.data.y = parseFloat(
          elementElem.style.top.substring(0, elementElem.style.top.length - 2),
        ) / 100;

        this.sendUpdate();
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    elementElem.ondragstart = () => false;

    return elementElem;
  }

  sendDelete() {
    socket.send(JSON.stringify({
      type: this.deleteEventName,
      id: this.id,
    }));
  }

  sendUpdate() {
    socket.send(JSON.stringify({
      type: this.updateEventName,
      id: this.id,
      [this.dataKeyName]: this.data,
    }));
  }

  applyUpdate(element) {
    this.data = element;

    this.element.style.left = `${element.x * 100}%`;
    this.element.style.top = `${element.y * 100}%`;
    this.element.style.width = `${this.width * 100}%`;
    this.element.querySelector('img').setAttribute('src', this.imagePath);
  }

  makeEditable() {
    this.editable = true;
    this.element.classList.add('editable');
  }

  makeUneditable() {
    this.editable = false;
    this.editing = false;

    this.element.classList.remove('editable');
    this.element.classList.remove('editing');
  }

  stopEditing() {
    this.editing = false;
    this.element.classList.remove('editing');
  }
}

export default Editable;
