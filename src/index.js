import { Character } from './js/Character'
import { Scene3D } from './js/ThreeD'
import { Element } from './js/element'
import { Hallway } from './js/hallway'
import Page from './js/page'
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
import createMap from './map'

const BACKGROUND_IMAGE_URL = "https://hackmit-playground-2020.s3.us-east-1.amazonaws.com/backgrounds/%SLUG%.png";
const MAPBOX_API_KEY = "pk.eyJ1IjoiaGFja21pdDIwIiwiYSI6ImNrZHVpaTk4dDE4Ym0yc255YzM3NGx0dGIifQ.XXstZ1xCBEqC-Wz4_EI8Pw";

class Game extends Page {
	start = () => {
		if (!window["WebSocket"]) {
			// TODO: Handle error -- tell people their browser is incompatible
		}

		// Quick check for auth data
		if (localStorage.getItem('token') !== null) {
			document.getElementById('login-panel').style.display = 'none';
		}

		this.scene = new Scene3D();

		this.characterID;
		this.characters = new Map();
		this.elements = new Map();
		this.hallways = new Map();
		this.room = null;

		this.editing = false;
		this.elementNames = [];
		this.roomNames = [];

		this.addClickListener("add-button", this.handleElementAddButton);
		this.addClickListener("add-hallway-button", this.handleHallwayAddButton);
		this.addClickListener("day-of-button", this.handleDayofButton);
		this.addClickListener("edit-button", this.handleEditButton);
		this.addClickListener("game", this.handleGameClick);
		this.addClickListener("map", this.handleShowMap);

		this.handleWindowSize();

		socket.onopen = this.handleSocketOpen;
		socket.onmessage = this.handleSocketMessage;
		socket.start();

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

		window.addEventListener('resize', function(e) {
			this.scene.fixCameraOnResize();
			handleWindowSize();
		});
	}

	handleGameClick = e => {
		// When clicking on the page, send a move message to the server
		if (e.target.id !== "three-canvas") {
			return false;
		}

		// Remove editable status from all elements
		let wasEditing = 0;

		for (let [_, element] of Object.entries(this.elements)) {
			if (!element.editing) {
				continue;
			}

			element.stopEditing();
			wasEditing += 1;
		}

		for (let [_, hallway] of Object.entries(this.hallways)) {
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
		let rect = document.getElementById("game").getBoundingClientRect();
		let x = (e.pageX - rect.x) / rect.width;
		let y = (e.pageY - rect.y) / rect.height;

		socket.send(JSON.stringify({
			x: x,
			y: y,
			type: 'move'
		}));
	}

	handleSocketOpen = () => {
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
	}

	handleSocketMessage = (e) => {
		var messages = e.data.split('\n');

		for (var i = 0; i < messages.length; i++) {
			var data = JSON.parse(messages[i]);

			if (data.type === 'init') {
				this.characterID = data.character.id;

				if (data.token !== undefined) {
					localStorage.setItem('token', data.token);
					history.pushState(null, null, ' ');
					document.getElementById('login-panel').style.display = 'none';
				}

				// Delete stuff from previous room
				this.scene.deleteAllCharacters();

				for (let [_, element] of Object.entries(this.elements)) {
					element.remove();
				}

				for (let [_, hallway] of Object.entries(this.hallways)) {
					hallway.remove();
				}

				for (let [key, value] of Object.entries(data.room.characters)) {
					scene.newCharacter(key, value.name, value.x, value.y)
				}

				this.elementNames = data.elementNames;
				this.roomNames = data.roomNames;

				for (let [id, element] of Object.entries(data.room.elements)) {
					let elementElem = new Element(element, id, data.elementNames);
					document.getElementById("game").appendChild(elementElem.element);
					this.elements[id] = elementElem;
				}

				for (let [id, hallway] of Object.entries(data.room.hallways)) {
					this.hallways[id] = new Hallway(hallway, id, data.roomNames);
					document.getElementById("game").appendChild(this.hallways[id].element);
				}

				this.room = data.room;

				if (this.room.sponsor) {
					document.getElementById("sponsor-pane").classList.add("active");
					document.getElementById("sponsor-name").innerHTML = "<span>" + this.room.slug + "</span>" + this.room.slug;
					document.getElementById("outer").classList.add("sponsor");
					document.getElementById("game").classList.add("sponsor");
				} else {
					document.getElementById("sponsor-pane").classList.remove("active");
					document.getElementById("outer").classList.remove("sponsor");
					document.getElementById("game").classList.remove("sponsor");
				}

				document.getElementById("game").style.backgroundImage = "url('" + BACKGROUND_IMAGE_URL.replace("%SLUG%", this.room.slug) + "')";

				this.scene.fixCameraOnResize();
			} else if (data.type === 'move') {
				this.scene.moveCharacter(data.id, data.x, data.y, () => {
					if (data.id !== this.characterID) {
						return;
					}

					for (let [id, hallway] of Object.entries(this.hallways)) {
						let distance = Math.sqrt(Math.pow(hallway.data.x - data.x, 2) + Math.pow(hallway.data.y - data.y, 2));

						if (distance > hallway.data.radius) {
							continue;
						}

						socket.send(JSON.stringify({
							type: 'teleport',
							from: this.room.slug,
							to: hallway.data.to
						}));

						break;
					}
				});
			} else if (data.type === 'element_add') {
				let elementElem = new Element(data.element, data.id, elementNames);
				document.getElementById("game").appendChild(elementElem.element);
				this.elements[data.id] = elementElem;
			} else if (data.type === 'element_delete') {
				this.elements[data.id].remove();
				delete this.elements[data.id];
			} else if (data.type === 'element_update') {
				this.elements[data.id].applyUpdate(data.element);
			} else if (data.type === 'hallway_add') {
				this.hallways[data.id] = new Hallway(data.hallway, data.id, roomNames);
				document.getElementById("game").appendChild(hallways[data.id].element);
			} else if (data.type === 'hallway_delete') {
				this.hallways[data.id].remove();
				delete this.hallways[data.id];
			} else if (data.type === 'hallway_update') {
				this.hallways[data.id].applyUpdate(data.hallway);
			} else if (data.type === 'error') {
				if (data.code === 1) {
					document.getElementById('login-panel').style.display = 'block';
				}
			} else if (data.type === 'join') {
				this.scene.newCharacter(data.character.id, data.character.name, data.character.x, data.character.y)
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
	}

	handleDayofButton = () => {
		let dayOfElem = document.createElement("iframe");
		dayOfElem.classList.add("day-of-page");
		dayOfElem.src = "https://dayof.hackmit.org";
		dayOfElem.id = "day-of-iframe";

		createModal(dayOfElem);
	}

	handleElementAddButton = () => {
		socket.send(JSON.stringify({
			type: 'element_add',
			element: {
				x: 0.2,
				y: 0.2,
				path: 'lamp.svg',
				width: 0.1
			}
		}));
	}

	handleHallwayAddButton = () => {
		socket.send(JSON.stringify({
			type: 'hallway_add',
			hallway: {
				x: 0.2,
				y: 0.2,
				radius: 0.1,
				to: "microsoft"
			}
		}));
	}

	handleEditButton = () => {
		this.editing = !this.editing;

		if (this.editing) {
			document.getElementById("add-button").classList.add("visible");
			document.getElementById("add-hallway-button").classList.add("visible");

			for (let [_, element] of Object.entries(this.elements)) {
				element.makeEditable();
			}

			for (let [_, hallway] of Object.entries(this.hallways)) {
				hallway.makeEditable();
			}
		} else {
			document.getElementById("add-button").classList.remove("visible");
			document.getElementById("add-hallway-button").classList.remove("visible");

			for (let [_, element] of Object.entries(this.elements)) {
				element.makeUneditable();
			}

			for (let [_, hallway] of Object.entries(this.hallways)) {
				hallway.makeUneditable();
			}
		}
	}

	handleWindowSize = () => {
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

	handleShowMap = () => {
		
		let mapElem = document.createElement("div");
		mapElem.classList.add("day-of-page"); // change "day-of-page" css
		mapElem.id = "map-frame";
		
		createModal(mapElem);

		mapboxgl.accessToken = MAPBOX_API_KEY;

		var map = new mapboxgl.Map({
			container: 'map-frame',
			style: 'mapbox://styles/mapbox/light-v10',
			center: [-71.0942, 42.3601],
			zoom: 7.5
		});

		createMap(map);
		
	}
}

let gamePage = new Game();

window.onload = () => {
	gamePage.start();
};

window.onSponsorLogin = () => {
	let joinPacket = {
		type: 'join',
		name: prompt("What's your name?")
	};

	// Connected to remote
	socket.send(JSON.stringify(joinPacket));
	console.log(joinPacket)
};

// gameElem.onclick = function(e) {
// 	let modalElemDiv = document.getElementById("modal-elem-div");
// 
// 	if (modalElemDiv !== null && e.target !== modalElemDiv) {
// 		modalElemDiv.remove();
// 	}
// }
