import { Character } from './js/character'
import './styles/index.scss'

import homeBackground from './images/home.png'
import drwBackground from './images/drw.png'

window.onload = function () {
    var conn;

    var characters = new Map();
    var room;

    // When clicking on the page, send a move message to the server
    document.addEventListener('click', function (e) {
        if (!conn) {
            return false;
        }

        let x = e.pageX / window.innerWidth;
        let y = e.pageY / window.innerHeight;

        conn.send(JSON.stringify({
            x: x,
            y: y,
            type: 'move'
        }));
    });

    if (window['WebSocket']) {
        let name = prompt('What\'s your name?');

        conn = new WebSocket('ws://' + 'localhost:8080' + '/ws');
        conn.onopen = function (evt) {
            // Connected to remote
            conn.send(JSON.stringify({
                name: name,
                type: 'join'
            }));
        };
        conn.onclose = function (evt) {
            // Disconnected from remote
        };
        conn.onmessage = function (evt) {
            var messages = evt.data.split('\n');

            for (var i = 0; i < messages.length; i++) {
                var data = JSON.parse(messages[i]);

                if (data.type === 'init') {
                    for (let key of Object.keys(characters)) {
                        characters[key].remove();
                        delete characters[key];
                    }

                    characters = new Map();

                    for (let [key, value] of Object.entries(data.room.characters)) {
                        characters[key] = new Character(value.name, value.x, value.y);
                    }

                    room = data.room;

                    if (room.slug === "home") {
                        document.body.style.background = "url('" + homeBackground + "')";
                    } else if (room.slug === "drw") {
                        document.body.style.background = "url('" + drwBackground + "')";
                    }
                } else if (data.type === 'move') {
                    characters[data.id].move(data.x, data.y, () => {
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
                } else if (data.type === 'join') {
                    characters[data.id] = new Character(data.name, data.x, data.y);
                } else if (data.type === 'leave') {
                    if (data.name === name) {
                        return;
                    }

                    characters[data.id].remove();
                    delete characters[data.id];
                } else {
                    console.log("received unknown packet: " + data.type)
                    console.log(data)
                }
            }
        };
    } else {
        var item = document.createElement('div');
        item.innerHTML = '<b>Your browser does not support WebSockets.</b>';
    }
};
