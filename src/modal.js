// eslint-disable-next-line
import createElement from './utils/jsxHelper';

import './styles/modal.scss';

function createModal(contentElem, modalType, onClose) {
  contentElem.insertBefore(
    <span
      className="modal-close-button"
      onclick={() => {
        if (onClose !== undefined) {
          onClose();
        }

        document.getElementById('modal-background').remove();
      }}
    >
      &times;
    </span>,
    contentElem.childNodes[0]
  );
  let modalElem;
  if (modalType === 'quarantine') {
    modalElem = (
      <div id="modal-background" className="modal-background">
        <div className="quarantine-modal">{contentElem}</div>
      </div>
    );
  } else if (modalType === 'queue') {
    modalElem = (
      <div id="modal-background" className="modal-background">
        <div className="modal-content">{contentElem}</div>
      </div>
    );
  } else if (modalType === 'form') {
    modalElem = (
      <div id="form-modal-background" className="modal-background">
        <div className="modal-content">{contentElem}</div>
      </div>
    );
  } else if (modalType === 'character') {
    modalElem = (
      <div id="modal-background" className="modal-background">
        <div className="modal-content" id="character-modal-content">{contentElem}</div>
      </div>
    );
  } else {
    modalElem = (
      <div id="modal-background" className="modal-background">
        <div className="modal-content">{contentElem}</div>
      </div>
    );
  }

  document.body.appendChild(modalElem);
}

export default createModal;
