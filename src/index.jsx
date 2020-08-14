import { Scene3D } from './js/ThreeD';
import { Element } from './js/element';
import { Hallway } from './js/hallway';
import Page from './js/page';
import socket from './js/socket';
import createModal from './modal';

import './styles/index.scss';
import './styles/sponsor.scss';
import './images/Code_Icon.svg';
import './images/Coffee_Icon.svg';
import './images/Site_Icon.svg';
import './images/sponsor_text.svg';
import './styles/coffeechat.scss';

import './coffeechat';

import './images/icons/add.svg';
import './images/icons/add-hallway.svg';
import './images/icons/edit.svg';

// eslint-disable-next-line
import createElement from './utils/jsxHelper';

const BACKGROUND_IMAGE_URL = 'https://hackmit-playground-2020.s3.us-east-1.amazonaws.com/backgrounds/%SLUG%.png';

class Game extends Page {
  start = () => {
    if (!window.WebSocket) {
      // TODO: Handle error -- tell people their browser is incompatible
    }

    // Quick check for auth data
    if (localStorage.getItem('token') !== null) {
      document.getElementById('login-panel').style.display = 'none';
    }

    this.scene = new Scene3D();

    this.characterId = null;
    this.characters = new Map();
    this.elements = new Map();
    this.hallways = new Map();
    this.room = null;

    this.editing = false;
    this.elementNames = [];
    this.roomNames = [];

    this.addClickListener('add-button', this.handleElementAddButton);
    this.addClickListener('add-hallway-button', this.handleHallwayAddButton);
    this.addClickListener('add-room-button', this.handleRoomAddButton);
    this.addClickListener('day-of-button', this.handleDayofButton);
    this.addClickListener('edit-button', this.handleEditButton);
    this.addClickListener('game', this.handleGameClick);
    this.addClickListener('sponsor-login-button', this.handleSponsorLogin);

    this.handleWindowSize();

    socket.onopen = this.handleSocketOpen;
    socket.onmessage = this.handleSocketMessage;
    socket.start();

    // Start sending chat events
    document.getElementById('chat-box').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        socket.send(JSON.stringify({
          type: 'chat',
          mssg: e.target.value,
        }));

        e.target.value = '';
      }
    });

    window.addEventListener('resize', () => {
      this.scene.fixCameraOnResize();
      this.handleWindowSize();
    });
  }

  handleGameClick = (e) => {
    // When clicking on the page, send a move message to the server
    if (e.target.id !== 'three-canvas') {
      return;
    }

    // Remove editable status from all elements
    let wasEditing = 0;

    this.elements.forEach((element) => {
      if (!element.editing) {
        return;
      }

      element.stopEditing();
      wasEditing += 1;
    });

    this.hallways.forEach((hallway) => {
      if (!hallway.editing) {
        return;
      }

      hallway.stopEditing();
      wasEditing += 1;
    });

    if (wasEditing > 0) {
      // If we were editing something, don't move immediately after
      return;
    }

    // Send move packet
    const rect = document.getElementById('game').getBoundingClientRect();
    const x = (e.pageX - rect.x) / rect.width;
    const y = (e.pageY - rect.y) / rect.height;

    socket.send(JSON.stringify({
      x,
      y,
      type: 'move',
    }));
  }

  handleSocketOpen = () => {
    const joinPacket = {
      type: 'join',
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
    const messages = e.data.split('\n');

    for (let i = 0; i < messages.length; i += 1) {
      const data = JSON.parse(messages[i]);

      if (data.type === 'init') {
        this.characterId = data.character.id;

        if (data.token !== undefined) {
          localStorage.setItem('token', data.token);
          window.Animationhistory.pushState(null, null, ' ');
          document.getElementById('login-panel').style.display = 'none';
        }

        // Delete stuff from previous room
        this.scene.deleteAllCharacters();

        this.elements.forEach((element) => {
          element.remove();
        });

        this.hallways.forEach((hallway) => {
          hallway.remove();
        });

        data.room.characters.forEach((id, character) => {
          this.scene.newCharacter(id, character.name, character.x, character.y);
        });

        this.elementNames = data.elementNames;
        this.roomNames = data.roomNames;

        data.room.elements.forEach((id, element) => {
          const elementElem = new Element(element, id, data.elementNames);
          document.getElementById('game').appendChild(elementElem.element);
          this.elements[id] = elementElem;
        });

        data.room.hallways.forEach((id, hallway) => {
          this.hallways[id] = new Hallway(hallway, id, data.roomNames);
          document.getElementById('game').appendChild(this.hallways[id].element);
        });

        this.room = data.room;

        if (this.room.sponsor) {
          document.getElementById('sponsor-pane').classList.add('active');
          document.getElementById('sponsor-name').innerHTML = `<span>${this.room.slug}</span>${this.room.slug}`;
          document.getElementById('outer').classList.add('sponsor');
          document.getElementById('game').classList.add('sponsor');
        } else {
          document.getElementById('sponsor-pane').classList.remove('active');
          document.getElementById('outer').classList.remove('sponsor');
          document.getElementById('game').classList.remove('sponsor');
        }

        document.getElementById('game').style.backgroundImage = `url('${BACKGROUND_IMAGE_URL.replace('%SLUG%', this.room.slug)}')`;

        this.scene.fixCameraOnResize();
      } else if (data.type === 'move') {
        this.scene.moveCharacter(data.id, data.x, data.y, () => {
          if (data.id !== this.characterId) {
            return;
          }

          // eslint-disable-next-line
          for (const [id, hallway] of Object.entries(this.hallways)) {
            const distance = Math.sqrt(
              (hallway.data.x - data.x) ** 2 + (hallway.data.y - data.y) ** 2,
            );

            if (distance <= hallway.data.radius) {
              socket.send(JSON.stringify({
                type: 'teleport',
                from: this.room.slug,
                to: hallway.data.to,
              }));

              break;
            }
          }
        });
      } else if (data.type === 'element_add') {
        const elementElem = new Element(data.element, data.id, this.elementNames);
        document.getElementById('game').appendChild(elementElem.element);
        this.elements[data.id] = elementElem;
      } else if (data.type === 'element_delete') {
        this.elements[data.id].remove();
        delete this.elements[data.id];
      } else if (data.type === 'element_update') {
        this.elements[data.id].applyUpdate(data.element);
      } else if (data.type === 'hallway_add') {
        this.hallways[data.id] = new Hallway(data.hallway, data.id, this.roomNames);
        document.getElementById('game').appendChild(this.hallways[data.id].element);
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
        this.scene.newCharacter(
          data.character.id, data.character.name, data.character.x, data.character.y,
        );
      } else if (data.type === 'leave') {
        if (data.character.id === this.characterId) {
          return;
        }
        this.scene.deleteCharacter(data.character.id);
      } else if (data.type === 'chat') {
        data.name = this.scene.sendChat(data.id, data.mssg);
      } else {
        console.log(`received unknown packet: ${data.type}`);
        console.log(data);
      }
    }
  }

  handleDayofButton = () => {
    createModal(
      <iframe
        id="day-of-iframe"
        className="day-of-page"
        src="https://dayof.hackmit.org" />,
    );
  }

  handleElementAddButton = () => {
    socket.send(JSON.stringify({
      type: 'element_add',
      element: {
        x: 0.2,
        y: 0.2,
        path: 'lamp.svg',
        width: 0.1,
      },
    }));
  }

  handleHallwayAddButton = () => {
    socket.send(JSON.stringify({
      type: 'hallway_add',
      hallway: {
        x: 0.2,
        y: 0.2,
        radius: 0.1,
        to: 'microsoft',
      },
    }));
  }

  handleRoomAddButton = () => {
  }

  handleEditButton = () => {
    this.editing = !this.editing;

    if (this.editing) {
      document.getElementById('add-button').classList.add('visible');
      document.getElementById('add-hallway-button').classList.add('visible');
      document.getElementById('add-room-button').classList.add('visible');

      this.elements.forEach((element) => {
        element.makeEditable();
      });

      this.hallways.forEach((hallway) => {
        hallway.makeEditable();
      });
    } else {
      document.getElementById('add-button').classList.remove('visible');
      document.getElementById('add-hallway-button').classList.remove('visible');
      document.getElementById('add-room-button').classList.remove('visible');

      this.elements.forEach((element) => {
        element.makeUneditable();
      });

      this.hallways.forEach((hallway) => {
        hallway.makeUneditable();
      });
    }
  }

  handleSponsorLogin = () => {
    const joinPacket = {
      type: 'join',
      name: prompt("What's your name?"),
    };

    // Connected to remote
    socket.send(JSON.stringify(joinPacket));
  }

  handleWindowSize = () => {
    const outerElem = document.getElementById('outer');

    if (window.innerWidth < window.innerHeight * (16 / 9)) {
      if (outerElem.classList.contains('vertical')) {
        return;
      }

      outerElem.classList.add('vertical');
    } else {
      if (!outerElem.classList.contains('vertical')) {
        return;
      }

      outerElem.classList.remove('vertical');
    }
  }
}

const gamePage = new Game();
window.onload = gamePage.start;
