import socket from './socket'
import deleteIcon from '../images/icons/delete.svg'

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
			this.element.classList.remove("invisible");
		} else {
			this.element.classList.add("invisible");
		}
	}

	remove() {
		this.element.remove();
		// TODO: Remove click listeners and stuff
	}

	createElement(elementNames) {
		let elementElem = document.createElement("div");
		elementElem.classList.add("element");
		elementElem.style.left = (this.data.x * 100) + "%";
		elementElem.style.top = (this.data.y * 100) + "%";
		elementElem.style.width = (this.width * 100) + "%";

		let imgElem = document.createElement("img");
		imgElem.classList.add("element-img");
		imgElem.setAttribute("src", this.imagePath);
		elementElem.appendChild(imgElem);

		let deleteButton = document.createElement("div");
		deleteButton.classList.add("delete");
		elementElem.appendChild(deleteButton);

		let deleteButtonImg = document.createElement("img");
		deleteButtonImg.setAttribute("src", deleteIcon);
		deleteButton.appendChild(deleteButtonImg);

		deleteButton.onclick = (e) => {
			this.sendDelete();
		};

		let pathSelect = document.createElement("select");

		for (let i = 0; i < elementNames.length; i++) {
			let optionElem = document.createElement("option");
			optionElem.value = elementNames[i];
			optionElem.text = elementNames[i].split(".")[0];
			pathSelect.appendChild(optionElem);
		}

		pathSelect.value = this.name;

		pathSelect.onchange = () => {
			this.onNameSelect(pathSelect.value);
		};

		elementElem.appendChild(pathSelect);

		let brResizeElem = document.createElement("div");
		brResizeElem.classList.add("resizer");
		brResizeElem.classList.add("bottom-right");
		elementElem.appendChild(brResizeElem);

		brResizeElem.onmousedown = function(e) {
			let outerRect = document.getElementById('outer').getBoundingClientRect();

			let startRect = elementElem.getBoundingClientRect();
			let startX = (elementElem.getBoundingClientRect().left - outerRect.left) + elementElem.getBoundingClientRect().width / 2;
			let startY = (elementElem.getBoundingClientRect().top - outerRect.top) + elementElem.getBoundingClientRect().height / 2;

			let shiftX = (elementElem.getBoundingClientRect().left - outerRect.left) + elementElem.getBoundingClientRect().width - (e.clientX - outerRect.left);
			let shiftY = (elementElem.getBoundingClientRect().top - outerRect.top) + elementElem.getBoundingClientRect().height - (e.clientY - outerRect.top);

			function resizeAt(pageX, pageY) {
				pageX -= outerRect.left;
				pageY -= outerRect.top;

				let newWidthX = pageX + shiftX - (startRect.left - outerRect.left);

				let newHeight = pageY + shiftY - (startRect.top - outerRect.top);
				let newWidthY = newHeight * (startRect.width / startRect.height);

				let newWidth = newWidthX > newWidthY ? newWidthX : newWidthY;

				elementElem.style.top = (startY + (newWidth * (startRect.height / startRect.width) - startRect.height) / 2) / outerRect.height * 100 + "%";
				elementElem.style.left = (startX + (newWidth - startRect.width) / 2) / outerRect.width * 100 + "%";
				elementElem.style.width = (newWidth - 4) / outerRect.width * 100 + "%";
			}

			resizeAt(e.pageX, e.pageY);

			function onMouseMove(e) {
				resizeAt(e.pageX, e.pageY);
			}

			let onMouseUp = e => {
				document.removeEventListener('mousemove', onMouseMove);
				document.removeEventListener('mouseup', onMouseUp);

				this.data.x = parseFloat(elementElem.style.left.substring(0, elementElem.style.left.length - 2)) / 100;
				this.data.y = parseFloat(elementElem.style.top.substring(0, elementElem.style.top.length - 2)) / 100;
				this.width = parseFloat(elementElem.style.width.substring(0, elementElem.style.width.length - 2)) / 100;
				this.sendUpdate();
			}

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
		};

		brResizeElem.ondragstart = function() {
			return false;
		};

		elementElem.onmousedown = (e) => {
			if (!this.editable) {
				return;
			}

			if (!e.target.classList.contains("element-img")) {
				return;
			}

			this.editing = true;
			elementElem.classList.add("editing");
			elementElem.classList.add("moving");

			let outerRect = document.getElementById('outer').getBoundingClientRect();

			let shiftX = (e.pageX - outerRect.left) - (elementElem.getBoundingClientRect().left - outerRect.left) - elementElem.getBoundingClientRect().width / 2;
			let shiftY = (e.pageY - outerRect.top) - (elementElem.getBoundingClientRect().top - outerRect.top) - elementElem.getBoundingClientRect().height / 2;

			function moveAt(pageX, pageY) {
				pageX -= outerRect.left;
				pageY -= outerRect.top;

				elementElem.style.left = (pageX - shiftX) / outerRect.width * 100 + "%";
				elementElem.style.top = (pageY - shiftY) / outerRect.height * 100 + "%";
			}

			moveAt(e.pageX, e.pageY);

			function onMouseMove(e) {
				moveAt(e.pageX, e.pageY);
			}

			let onMouseUp = e => {
				elementElem.classList.remove("moving");

				document.removeEventListener('mousemove', onMouseMove);
				document.removeEventListener('mouseup', onMouseUp);

				elementElem.onmouseup = null;

				this.data.x = parseFloat(elementElem.style.left.substring(0, elementElem.style.left.length - 2)) / 100;
				this.data.y = parseFloat(elementElem.style.top.substring(0, elementElem.style.top.length - 2)) / 100;
				this.sendUpdate();
			}

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
		};

		elementElem.ondragstart = function() {
			return false;
		};

		return elementElem;
	}

	sendDelete() {
		socket.send(JSON.stringify({
			type: this.deleteEventName,
			id: this.id
		}));
	}

	sendUpdate() {
		socket.send(JSON.stringify({
			type: this.updateEventName,
			id: this.id,
			[this.dataKeyName]: this.data
		}));
	}

	applyUpdate(element) {
		this.data = element;

		this.element.style.left = (element.x * 100) + "%";
		this.element.style.top = (element.y * 100) + "%";
		this.element.style.width = (this.width * 100) + "%";
		this.element.querySelector("img").setAttribute("src", this.imagePath);
	}

	makeEditable() {
		this.editable = true;
		this.element.classList.add("editable");
	}

	makeUneditable() {
		this.editable = false;
		this.editing = false;

		this.element.classList.remove("editable");
		this.element.classList.remove("editing");
	}

	stopEditing() {
		this.editing = false;
		this.element.classList.remove("editing");
	}
}

export {
	Editable
};
