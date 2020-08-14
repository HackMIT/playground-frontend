import createModal from './modal';

document.getElementById("map").addEventListener("click", function() {
	console.log("hello")

    let mapElem = document.createElement("iframe");
	mapElem.classList.add("map-page");
	mapElem.id = "map-iframe";

	createModal("Hacker Map!", mapElem, [{}]);
})
