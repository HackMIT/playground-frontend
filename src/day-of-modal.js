function createDayOfModal(contentElem, buttons) {
	let modalElem = document.createElement("div");
	modalElem.classList.add("modal-content-dayof");
    modalElem.classList.add("visible");
    modalElem.id = "modal-elem-div";

    let closeButtonElem = document.createElement("span");
    closeButtonElem.classList.add("close-day-of");
    closeButtonElem.innerHTML = "&times;";
    closeButtonElem.onclick = function() {
        modalElem.remove();
    }

    modalElem.appendChild(closeButtonElem);
    modalElem.appendChild(contentElem);

	document.body.appendChild(modalElem);
}

export default createDayOfModal;
