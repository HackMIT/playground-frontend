import { Character } from './js/character'
import './styles/index.scss'

window.onload = function () {
    var conn;

    var characters = {};

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
        };
        conn.onclose = function (evt) {
            // Disconnected from remote
        };
        conn.onmessage = function (evt) {
            var messages = evt.data.split('\n');

            for (var i = 0; i < messages.length; i++) {
                var data = JSON.parse(messages[i]);

                if (data.type === 'init') {
                    for (let [key, value] of Object.entries(data.characters)) {
                        characters[key] = new Character(value.name, value.x, value.y);
                    }

                    conn.send(JSON.stringify({
                        name: name,
                        type: 'join'
                    }));
                } else if (data.type === 'move') {
                    characters[data.id].move(data.x, data.y);
                } else if (data.type === 'join') {
                    characters[data.id] = new Character(data.name);
                } else if (data.type === 'leave') {
                    characters[data.id].remove();
                    characters.delete(data.id);
                }
            }
        };
    } else {
        var item = document.createElement('div');
        item.innerHTML = '<b>Your browser does not support WebSockets.</b>';
    }
};
