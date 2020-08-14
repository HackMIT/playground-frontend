import { Character } from './js/Character'
import { Scene3D } from './js/ThreeD'
import { Element } from './js/element'
import { Hallway } from './js/hallway'
import socket from './js/socket'
import createModal from './modal';
import './styles/index.scss'
import './styles/sponsor.scss'
import './images/Code_Icon.svg'
import './images/Coffee_Icon.svg'
import './images/Site_Icon.svg'
import './images/sponsor_text.svg'
import './styles/coffeechat.scss'

import './coffeechat';

import deleteIcon from './images/icons/delete.svg';
import './images/icons/add.svg';
import './images/icons/add-hallway.svg';
import './images/icons/edit.svg';

const BACKGROUND_IMAGE_URL = "https://hackmit-playground-2020.s3.us-east-1.amazonaws.com/%SLUG%.png";

let editing;
let elementNames;
let roomNames;

let gameElem = document.getElementById("game");

function handleWindowSize() {
	let outerElem = document.getElementById("outer");

	if (window.innerWidth < window.innerHeight * (16 / 9)) {
		if (outerElem.classList.contains("vertical")) {
			return;
		}

		outerElem.classList.add("vertical");
	} else {
		if (!outerElem.classList.contains("vertical")) {
			return;
		}

		outerElem.classList.remove("vertical");
	}
}

window.onSponsorLogin = () => {
	let joinPacket = {
		type: 'join',
		name: prompt("What's your name?")
	};

	// Connected to remote
	socket.send(JSON.stringify(joinPacket));
};

// gameElem.onclick = function(e) {
// 	let modalElemDiv = document.getElementById("modal-elem-div");
// 
// 	if (modalElemDiv !== null && e.target !== modalElemDiv) {
// 		modalElemDiv.remove();
// 	}
// }

window.onload = function () {
	// Quick check for auth data
	if (localStorage.getItem('token') !== null) {
		document.getElementById('login-panel').style.display = 'none';
	}
	var scene = new Scene3D();

	// var characters = new Map();
	var characterID;
	var characters = new Map();

	var elements = new Map();
	var hallways = new Map();

	var room;

	handleWindowSize();

	// When clicking on the page, send a move message to the server
	gameElem.addEventListener('click', function (e) {
		if (e.target.id !== "three-canvas") {
			return false;
		}

		// Remove editable status from all elements
		let wasEditing = 0;

		for (let [_, element] of Object.entries(elements)) {
			if (!element.editing) {
				continue;
			}

			element.stopEditing();
			wasEditing += 1;
		}

		for (let [_, hallway] of Object.entries(hallways)) {
			if (!hallway.editing) {
				continue;
			}

			hallway.stopEditing();
			wasEditing += 1;
		}

		if (wasEditing > 0) {
			// If we were editing something, don't move immediately after
			return;
		}

		// Send move packet
		let rect = gameElem.getBoundingClientRect();
		let x = (e.pageX - rect.x) / rect.width;
		let y = (e.pageY - rect.y) / rect.height;

		socket.send(JSON.stringify({
			x: x,
			y: y,
			type: 'move'
		}));
	});

	document.getElementById("edit-button").addEventListener("click", function(e) {
		editing = !editing;

		if (editing) {
			document.getElementById("add-button").classList.add("visible");
			document.getElementById("add-hallway-button").classList.add("visible");

			for (let [_, element] of Object.entries(elements)) {
				element.makeEditable();
			}

			for (let [_, hallway] of Object.entries(hallways)) {
				hallway.makeEditable();
			}
		} else {
			document.getElementById("add-button").classList.remove("visible");
			document.getElementById("add-hallway-button").classList.remove("visible");

			for (let [_, element] of Object.entries(elements)) {
				element.makeUneditable();
			}

			for (let [_, hallway] of Object.entries(hallways)) {
				hallway.makeUneditable();
			}
		}
	});

	document.getElementById("add-button").addEventListener('click', function(e) {
		socket.send(JSON.stringify({
			type: 'element_add',
			element: {
				x: 0.2,
				y: 0.2,
				path: 'lamp.svg',
				width: 0.1
			}
		}));
	});

	document.getElementById("add-hallway-button").addEventListener('click', function(e) {
		socket.send(JSON.stringify({
			type: 'hallway_add',
			hallway: {
				x: 0.2,
				y: 0.2,
				radius: 0.1,
				to: "microsoft"
			}
		}));
	});

	// Start sending chat events
	document.getElementById('chat-box').addEventListener('keypress', function (e) {
		if (e.key === 'Enter') { 
			socket.send(JSON.stringify({
				type: 'chat',
				mssg: e.target.value
			}))

			e.target.value = '';
		}
	});

	document.getElementById('day-of-button').addEventListener('click', (e) => {
		let dayOfElem = document.createElement("iframe");
		dayOfElem.classList.add("day-of-page");
		dayOfElem.src = "https://dayof.hackmit.org";
		dayOfElem.id = "day-of-iframe";

		createModal(dayOfElem);
	});

	window.addEventListener('resize', function(e) {
		scene.fixCameraOnResize();
		handleWindowSize();
	});

	if (window['WebSocket']) {
		socket.onopen = function (evt) {
			let joinPacket = {
				type: 'join'
			};

			if (localStorage.getItem('token') !== null) {
				joinPacket.token = localStorage.getItem('token');
			} else if (window.location.hash.length > 1) {
				joinPacket.quillToken = document.location.hash.substring(1);
			} else {
				// No auth data
				return;
			}

			// Connected to remote
			socket.send(JSON.stringify(joinPacket));
		};
		socket.onclose = function (evt) {
			// Disconnected from remote
		};
		socket.onmessage = function (evt) {
			var messages = evt.data.split('\n');

			for (var i = 0; i < messages.length; i++) {
				var data = JSON.parse(messages[i]);

				if (data.type === 'init') {
					characterID = data.character.id;

					if (data.token !== undefined) {
						localStorage.setItem('token', data.token);
						history.pushState(null, null, ' ');
						document.getElementById('login-panel').style.display = 'none';
					}

					// Delete stuff from previous room
					scene.deleteAllCharacters();

					for (let [_, element] of Object.entries(elements)) {
						element.remove();
					}

					for (let [_, hallway] of Object.entries(hallways)) {
						hallway.remove();
					}

					for (let [key, value] of Object.entries(data.room.characters)) {
						scene.newCharacter(key, value.name, value.x, value.y)
					}

					elementNames = data.elementNames;
					roomNames = data.roomNames;

					for (let [id, element] of Object.entries(data.room.elements)) {
						let elementElem = new Element(element, id, data.elementNames);
						gameElem.appendChild(elementElem.element);
						elements[id] = elementElem;
					}

					for (let [id, hallway] of Object.entries(data.room.hallways)) {
						hallways[id] = new Hallway(hallway, id, data.roomNames);
						gameElem.appendChild(hallways[id].element);
					}

					room = data.room;
					console.log(room)

					if (room.sponsor) {
						console.log("is sponsor")
						document.getElementById("sponsor-pane").classList.add("active");
						document.getElementById("sponsor-name").innerHTML = "<span>" + room.slug + "</span>" + room.slug;
						document.getElementById("outer").classList.add("sponsor");
						gameElem.classList.add("sponsor");
					} else {
						document.getElementById("sponsor-pane").classList.remove("active");
						document.getElementById("outer").classList.remove("sponsor");
						gameElem.classList.remove("sponsor");
					}

					gameElem.style.backgroundImage = "url('" + BACKGROUND_IMAGE_URL.replace("%SLUG%", room.slug) + "')";

					scene.fixCameraOnResize();
				} else if (data.type === 'move') {
					scene.moveCharacter(data.id, data.x, data.y, () => {
						if (data.id !== characterID) {
							return;
						}

						for (let [id, hallway] of Object.entries(hallways)) {
							let distance = Math.sqrt(Math.pow(hallway.data.x - data.x, 2) + Math.pow(hallway.data.y - data.y, 2));

							if (distance > hallway.data.radius) {
								continue;
							}

							socket.send(JSON.stringify({
								type: 'teleport',
								from: room.slug,
								to: hallway.data.to
							}));

							break;
						}
					});
				} else if (data.type === 'element_add') {
					let elementElem = new Element(data.element, data.id, elementNames);
					gameElem.appendChild(elementElem.element);
					elements[data.id] = elementElem;
				} else if (data.type === 'element_delete') {
					elements[data.id].remove();
					delete elements[data.id];
				} else if (data.type === 'element_update') {
					elements[data.id].applyUpdate(data.element);
				} else if (data.type === 'hallway_add') {
					hallways[data.id] = new Hallway(data.hallway, data.id, roomNames);
					gameElem.appendChild(hallways[data.id].element);
				} else if (data.type === 'hallway_delete') {
					hallways[data.id].remove();
					delete hallways[data.id];
				} else if (data.type === 'hallway_update') {
					hallways[data.id].applyUpdate(data.hallway);
				} else if (data.type === 'error') {
					if (data.code === 1) {
						document.getElementById('login-panel').style.display = 'block';
					}
				} else if (data.type === 'join') {
					scene.newCharacter(data.character.id, data.character.name, data.character.x, data.character.y)
				} else if (data.type === 'leave') {
					if (data.character.id === characterID) {
						return;
					}
					scene.deleteCharacter(data.character.id)

				} else if (data.type == 'chat') {
					data.name = scene.sendChat(data.id, data.mssg);
				} else {
					console.log('received unknown packet: ' + data.type)
					console.log(data)
				}
			}
		};

		socket.start();
	} else {
		var item = document.createElement('div');
		item.innerHTML = '<b>Your browser does not support WebSockets.</b>';
	}
};
