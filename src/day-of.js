import createDayOfModal from './day-of-modal';

window.onDayOfClick = () => {
	let dayOfElem = document.createElement("iframe");
	dayOfElem.classList.add("day-of-page");
	dayOfElem.src = "https://dayof.hackmit.org";
	dayOfElem.id = "day-of-iframe";

	createDayOfModal(dayOfElem, [{}]);
};
