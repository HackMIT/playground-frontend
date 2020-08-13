import socket from './socket'
import { Editable } from './editable'

class Element extends Editable {

	dataKeyName = 'element';
	deleteEventName = 'element_delete';
	updateEventName = 'element_update';

	get imagePath() {
		return "https://hackmit-playground-2020.s3.amazonaws.com/elements/" + this.data.path;
	}

	get name() {
		return this.data.path;
	}

	get width() {
		return this.data.width;
	}

	set width(newValue) {
		this.data.radius = newValue;
	}

	onNameSelect(value) {
		this.data.path = value;
		this.sendUpdate(this.data);
	}
}

export {
	Element
};
