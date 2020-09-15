// eslint-disable-next-line
import createElement from './utils/jsxHelper';

import './styles/modal.scss';

function createModal(contentElem, modalType, onClose) {
  let modalElem;
  if (modalType === "quarantine") {
    modalElem = (
      <div id="modal-background" className="modal-background">
        <div className="quarantine-modal">
          <button className="modal-close-button" onclick={() => document.getElementById('modal-background').remove()}>
            &times;
          </button>
          {contentElem}
        </div>
      </div>
    );
  } else if (modalType === "queue") {
    modalElem = (
      <div id="modal-background" className="modal-background">
        <div className="modal-content">
          <button className="modal-close-button" onclick={() => { onClose(); document.getElementById('modal-background').remove() }}>
            &times;
        </button>
          {contentElem}
        </div>
      </div>
    );
  } else {
    modalElem = (
      <div id="modal-background" className="modal-background">
        <div className="modal-content">
          <button className="modal-close-button" onclick={() => document.getElementById('modal-background').remove()}>
            &times;
        </button>
          {contentElem}
        </div>
      </div>
    );
  }

  document.body.appendChild(modalElem);
}

export default createModal;
