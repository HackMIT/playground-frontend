import { Character } from './js/Character'
import { Scene3D } from './js/ThreeD'
import { Interactable } from './js/Interactable'
import './styles/index.scss'
import './styles/sponsor.scss'
import './images/Code_Icon.svg'
import './images/Coffee_Icon.svg'
import './images/Site_Icon.svg'
import './images/sponsor_text.svg'
import './styles/coffeechat.scss'

import './coffeechat';

import deleteIcon from './images/icons/delete.svg';

const BACKGROUND_IMAGE_URL = "https://hackmit-playground-2020.s3.us-east-1.amazonaws.com/%SLUG%.png";

//let conn = new WebSocket('ws://' + 'ec2-3-81-187-93.compute-1.amazonaws.com:8080' + '/ws');
let conn;

window.onSponsorLogin = () => {
	let joinPacket = {
		type: 'join',
		name: prompt("What's your name?")
	};

	// Connected to remote
	conn.send(JSON.stringify(joinPacket));
};

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

	var interactables = new Map();
	var room;

	let gameElem = document.getElementById("game");

	// When clicking on the page, send a move message to the server
	gameElem.addEventListener('click', function (e) {
		if (!conn) {
			return false;
		}

		if (e.target.classList.contains("element") || e.target.parentElement.classList.contains("element")) {
			return false;
		}

		// Remove editable status from all elements
		let elements = document.getElementsByClassName("element");
		let wasEditing = 0;

		for (var i = 0; i < elements.length; i++) {
			if (!elements.item(i).classList.contains("editing")) {
				continue;
			}

			elements.item(i).classList.remove("editing");
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

		conn.send(JSON.stringify({
			x: x,
			y: y,
			type: 'move'
		}));
	});

	window.addEventListener('resize', function(e) {
		scene.fixCameraOnResize()
	});

	if (window['WebSocket']) {
		conn = new WebSocket('ws://' + 'localhost:8080' + '/ws');
		conn.onopen = function (evt) {
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
			conn.send(JSON.stringify(joinPacket));
		};
		conn.onclose = function (evt) {
			// Disconnected from remote
		};
		conn.onmessage = function (evt) {
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

					scene.deleteAllCharacters();

					for (let [key, value] of Object.entries(data.room.characters)) {
						scene.newCharacter(key, value.name, value.x, value.y)
						// characters[key] = new Character(value.name, value.x, value.y);
					}

					for (let [key, value] of Object.entries(data.room.interactables)) {
						interactables[key] = new Interactable(value.action, value.appearance, value.x, value.y);
					}

					for (let [id, element] of Object.entries(data.room.elements)) {
						let elementElem = document.createElement("div");
						elementElem.classList.add("element");
						elementElem.style.left = (element.x * 100) + "vw";
						elementElem.style.top = (element.y * 100) + "vh";
						elementElem.style.width = (element.width * 100) + "vw";
						elements[id] = elementElem;

						let imgElem = document.createElement("img");
						imgElem.setAttribute("src", "https://hackmit-playground-2020.s3.amazonaws.com/elements/lamp.svg");
						elementElem.appendChild(imgElem);
						gameElem.appendChild(elementElem);

						let deleteButton = document.createElement("div");
						deleteButton.classList.add("delete");
						elementElem.appendChild(deleteButton);

						let deleteButtonImg = document.createElement("img");
						deleteButtonImg.setAttribute("src", deleteIcon);
						deleteButton.appendChild(deleteButtonImg);

						deleteButton.onclick = function(e) {
							conn.send(JSON.stringify({
								type: 'element_delete',
								room: data.room.slug,
								id: id
							}));
						};

						let brResizeElem = document.createElement("div");
						brResizeElem.classList.add("resizer");
						brResizeElem.classList.add("bottom-right");
						elementElem.appendChild(brResizeElem);

						brResizeElem.onmousedown = function(e) {
							let startRect = elementElem.getBoundingClientRect();
							let startX = elementElem.getBoundingClientRect().left + elementElem.getBoundingClientRect().width / 2;
							let startY = elementElem.getBoundingClientRect().top + elementElem.getBoundingClientRect().height / 2;

							let shiftX = elementElem.getBoundingClientRect().left + elementElem.getBoundingClientRect().width - e.clientX;
							let shiftY = elementElem.getBoundingClientRect().top + elementElem.getBoundingClientRect().height - e.clientY;

							function resizeAt(pageX, pageY) {
								let newWidthX = pageX + shiftX - startRect.left;

								let newHeight = pageY + shiftY - startRect.top;
								let newWidthY = newHeight * (startRect.width / startRect.height);

								let newWidth = newWidthX > newWidthY ? newWidthX : newWidthY;

								elementElem.style.top = (startY + (newWidth * (startRect.height / startRect.width) - startRect.height) / 2) / window.innerHeight * 100 + "vh";
								elementElem.style.left = (startX + (newWidth - startRect.width) / 2) / window.innerWidth * 100 + "vw";
								elementElem.style.width = (newWidth - 4) / window.innerWidth * 100 + "vw";
							}

							resizeAt(e.pageX, e.pageY);

							function onMouseMove(e) {
								resizeAt(e.pageX, e.pageY);
							}

							document.addEventListener('mousemove', onMouseMove);

							document.addEventListener('mouseup', function() {
								document.removeEventListener('mousemove', onMouseMove);
								elementElem.onmouseup = null;

								element.x = parseFloat(elementElem.style.left.substring(0, elementElem.style.left.length - 2)) / 100;
								element.y = parseFloat(elementElem.style.top.substring(0, elementElem.style.top.length - 2)) / 100;
								element.width = parseFloat(elementElem.style.width.substring(0, elementElem.style.width.length - 2)) / 100;

								conn.send(JSON.stringify({
									type: 'element_update',
									room: data.room.slug,
									id: id,
									element: element
								}));
							});
						};

						brResizeElem.ondragstart = function() {
							return false;
						};

						elementElem.onmousedown = function(e) {
							if (e.target.classList.contains("resizer")) {
								return;
							}

							elementElem.classList.add("editing");
							elementElem.classList.add("moving");

							let shiftX = e.clientX - elementElem.getBoundingClientRect().left - elementElem.getBoundingClientRect().width / 2;
							let shiftY = e.clientY - elementElem.getBoundingClientRect().top - elementElem.getBoundingClientRect().height / 2;

							function moveAt(pageX, pageY) {
								elementElem.style.left = (pageX - shiftX) / window.innerWidth * 100 + "vw";
								elementElem.style.top = (pageY - shiftY) / window.innerHeight * 100 + "vh";
						    }

							moveAt(e.pageX, e.pageY);

                            function onMouseMove(e) {
                                moveAt(e.pageX, e.pageY);
                            }

                            // (2) move the ball on mousemove
                            document.addEventListener('mousemove', onMouseMove);

                            // (3) drop the ball, remove unneeded handlers
                            document.addEventListener('mouseup', function() {
								elementElem.classList.remove("moving");

                                document.removeEventListener('mousemove', onMouseMove);
                                elementElem.onmouseup = null;

								element.x = parseFloat(elementElem.style.left.substring(0, elementElem.style.left.length - 2)) / 100;
								element.y = parseFloat(elementElem.style.top.substring(0, elementElem.style.top.length - 2)) / 100;

								conn.send(JSON.stringify({
									type: 'element_update',
									room: data.room.slug,
									id: id,
									element: element
								}));
							});
						};

						elementElem.ondragstart = function() {
							return false;
						};
					}

					room = data.room;

					if (room.sponsor) {
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

					// Start sending chat events
					document.getElementById('chat-box').addEventListener('keypress', function (e) {
						if (e.key === 'Enter') { 
							conn.send(JSON.stringify({
								type: 'chat',
								mssg: e.target.value
							}))

							e.target.value = '';
						}
					});

					scene.fixCameraOnResize();
				} else if (data.type === 'move') {
					scene.moveCharacter(data.id, data.x, data.y, () => {
						if (data.id !== characterID) {
							return;
						}

						for (const hallway of room.hallways) {
							let distance = Math.sqrt(Math.pow(hallway.x - data.x, 2) + Math.pow(hallway.y - data.y, 2));

							if (distance > hallway.radius) {
								continue;
							}

							conn.send(JSON.stringify({
								type: 'teleport',
								from: room.slug,
								to: hallway.to
							}));

							break;
						}
					});
				} else if (data.type === 'element_delete') {
					elements[data.id].remove();
					delete elements[data.id];
				} else if (data.type === 'element_update') {
					elements[data.id].style.left = (data.element.x * 100) + "vw";
					elements[data.id].style.top = (data.element.y * 100) + "vh";
					elements[data.id].style.width = (data.element.width * 100) + "vw";
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

	} else {
		var item = document.createElement('div');
		item.innerHTML = '<b>Your browser does not support WebSockets.</b>';
	}
};
