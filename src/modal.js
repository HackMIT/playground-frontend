import './styles/modal.scss'

function createModal(contentElem) {
	let backgroundElem = document.createElement("div");
	backgroundElem.classList.add("modal-background");

	let modalElem = document.createElement("div");
	modalElem.classList.add("modal-content");

    let closeButtonElem = document.createElement("span");
	closeButtonElem.classList.add("modal-close-button");
    closeButtonElem.innerHTML = "&times;";

    closeButtonElem.onclick = function() {
        backgroundElem.remove();
    }

    modalElem.appendChild(closeButtonElem);
    modalElem.appendChild(contentElem);
	backgroundElem.appendChild(modalElem);

	document.body.appendChild(backgroundElem);
}

export default createModal;
