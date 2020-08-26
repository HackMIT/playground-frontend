// eslint-disable-next-line
import createElement from './utils/jsxHelper';

import './styles/modal.scss';

function createModal(contentElem, modalType) {
  let modalElem;
  if (modalType === "quarantine") {
    modalElem = (
      <div id="modal-background" className="modal-background">
        <div className="quarantine-modal">
          <span className="modal-close-button" onclick={() => document.getElementById('modal-background').remove()}>
            &times;
          </span>
          {contentElem}
        </div>
      </div>
    );
  } else {
    modalElem = (
      <div id="modal-background" className="modal-background">
        <div className="modal-content">
          <span className="modal-close-button" onclick={() => document.getElementById('modal-background').remove()}>
            &times;
        </span>
          {contentElem}
        </div>
      </div>
    );
  }

  document.body.appendChild(modalElem);
}

export default createModal;
