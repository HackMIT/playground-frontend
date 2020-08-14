import './styles/modal.scss';

function createModal(contentElem) {
  const backgroundElem = document.createElement('div');
  backgroundElem.classList.add('modal-background');

  const modalElem = document.createElement('div');
  modalElem.classList.add('modal-content');

  const closeButtonElem = document.createElement('span');
  closeButtonElem.classList.add('modal-close-button');
  closeButtonElem.innerHTML = '&times;';

  closeButtonElem.onclick = () => {
    backgroundElem.remove();
  };

  modalElem.appendChild(closeButtonElem);
  modalElem.appendChild(contentElem);
  backgroundElem.appendChild(modalElem);

  document.body.appendChild(backgroundElem);
}

export default createModal;