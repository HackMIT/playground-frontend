function createModal(title, contentElem, buttons) {
	let modalElem = document.createElement("div");
	modalElem.classList.add("modal");
	modalElem.classList.add("visible");

	let modalDialogElem = document.createElement("div");
	modalDialogElem.classList.add("modal-dialog");
	modalElem.appendChild(modalDialogElem);

	// Header
	let modalHeaderElem = document.createElement("header");
	modalHeaderElem.classList.add("modal-header");
	modalDialogElem.appendChild(modalHeaderElem);

	let titleElem = document.createElement("span");
	titleElem.innerHTML = title;
	modalHeaderElem.appendChild(titleElem);

	let closeButtonElem = document.createElement("button");
	closeButtonElem.classList.add("close-modal");
	closeButtonElem.innerHTML = "✕";
	closeButtonElem.onclick = function() {
		modalElem.remove();
	};
	modalHeaderElem.appendChild(closeButtonElem);

	// Section
	let modalSectionElem = document.createElement("section");
	modalSectionElem.classList.add("modal-content");
	modalSectionElem.appendChild(contentElem);
	modalDialogElem.appendChild(modalSectionElem);

	// Footer
	let modalFooterElem = document.createElement("footer");
	modalFooterElem.classList.add("modal-footer");
	modalDialogElem.appendChild(modalFooterElem);

	for (let i = 0; i < buttons.length; i++) {
		let buttonElem = document.createElement("input");
		buttonElem.setAttribute("title", buttons[i]);
		modalFooterElem.appendChild(buttonElem);

		if (buttons[i].type === "submit") {
			buttonElem.setAttribute("type", "submit");
			buttonElem.onclick = function() {
				buttons[i].action();
				modalElem.remove();
			};
		}
	}

	document.body.appendChild(modalElem);
}

export default createModal;
