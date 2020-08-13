import { Editable } from './editable'

class Hallway extends Editable {

	dataKeyName = "hallway";
	deleteEventName = "hallway_delete";
	updateEventName = "hallway_update";

	constructor(element, id, elementNames) {
		super(element, id, elementNames, true);
		this.visible = false;
	}

	get name() {
		return this.data.to;
	}

	get imagePath() {
		return "https://vignette.wikia.nocookie.net/dont-starve-game/images/4/40/Map_Icon_Florid_Postern.png/revision/latest?cb=20180903223451";
	}

	get width() {
		return this.data.radius * 2;
	}

	set width(newValue) {
		this.data.radius = newValue / 2;
	}

	onNameSelect(value) {
		let data = this.data;
		data.to = value;
		this.sendUpdate(data);
	}

	makeEditable() {
		super.makeEditable();
		this.visible = true;
	}

	makeUneditable() {
		super.makeUneditable();
		this.visible = false;
	}
}

export {
	Hallway
};
