import { Character } from './js/Character'
import { Interactable } from './js/Interactable'
import './styles/index.scss'
import './styles/sponsor.scss'
import './styles/styles.scss'
import homeBackground from './images/home.png'
import drwBackground from './images/drw.png'
import sponsorBackground from './images/sponsor.png'

let conn = new WebSocket('ws://' + 'localhost:8080' + '/ws');

window.onSponsorLogin = function() {
    let joinPacket = {
        type: 'join',
        name: prompt("What's your name?")
    };

    // Connected to remote
    conn.send(JSON.stringify(joinPacket));
};

window.onCoffeeChat = function () {
    document.getElementById("modal1").classList.add("visible");
};

window.onCloseCoffeeChat = function () {
    document.getElementById("modal1").classList.remove("visible");
};

window.onload = function () {
    // Quick check for auth data
    if (localStorage.getItem('token') !== null) {
        document.getElementById('login-panel').style.display = 'none';
    }

    var characterID;
    var characters = new Map();
    var interactables = new Map();
    var room;

    let gameElem = document.getElementById("game");

    // When clicking on the page, send a move message to the server
    gameElem.addEventListener('click', function (e) {
        if (!conn) {
            return false;
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

    if (window['WebSocket']) {
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
                console.log(data)

                if (data.type === 'init') {
                    characterID = data.character.id;

                    if (data.token !== undefined) {
                        localStorage.setItem('token', data.token);
                        history.pushState(null, null, ' ');
                        document.getElementById('login-panel').style.display = 'none';
                    }

                    for (let key of Object.keys(characters)) {
                        characters[key].remove();
                        delete characters[key];
                    }

                    characters = new Map();

                    for (let [key, value] of Object.entries(data.room.characters)) {
                        characters[key] = new Character(value);
                    }

                    for (let [key, value] of Object.entries(data.room.interactables)) {
                        interactables[key] = new Interactable(value.action, value.appearance, value.x, value.y);
                    }

                    room = data.room;

                    if (room.slug === 'home') {
                        gameElem.style.backgroundImage = "url('" + homeBackground + "')";
                    } else if (room.slug === 'sponsor') {
                        gameElem.style.backgroundImage = "url('" + sponsorBackground + "')";
                        gameElem.classList.add("sponsor");
                        document.getElementById("sponsor-pane").classList.add("active");
                        document.getElementById("outer").classList.add("sponsor");
                    }

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
                } else if (data.type === 'move') {
                    characters[data.id].move(data.x, data.y, () => {
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
                } else if (data.type === 'error') {
                    if (data.code === 1) {
                        document.getElementById('login-panel').style.display = 'block';
                    }
                } else if (data.type === 'join') {
                    characters[data.character.id] = new Character(data.character);
                } else if (data.type === 'leave') {
                    if (data.id === characterID) {
                        return;
                    }

                    characters[data.id].remove();
                    delete characters[data.id];
                } else if (data.type == 'chat') {
                    data.name = characters[data.id].name
                    characters[data.id].updateChatBubble(data.mssg)
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
