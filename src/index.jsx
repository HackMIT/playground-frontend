import Scene from './js/scene';
import Element from './js/element';
import Hallway from './js/hallway';
import Page from './js/page';
import socket from './js/socket';
import createModal from './modal';
import settings from './settings.jsx';
import friends from './js/components/friends';
import jukebox from './jukebox';
import createLoadingScreen from './js/components/loading';

import './styles/index.scss';
import './styles/sponsor.scss';
import './images/Code_Icon.svg';
import './images/Coffee_Icon.svg';
import './images/Site_Icon.svg';
import './images/sponsor_text.svg';
import './styles/coffeechat.scss';

import './coffeechat';

import './images/icons/dance.svg';
import './images/icons/edit.svg';
import './images/icons/friends.svg';
import './images/icons/home.svg';
import './images/icons/home-white.svg';
import './images/icons/music.svg';
import './images/icons/portal.png';
import './images/icons/send.svg';
import './images/icons/settings.svg';
import './images/icons/tree.svg';

// eslint-disable-next-line
import createElement from './utils/jsxHelper';

const BACKGROUND_IMAGE_URL =
  'https://hackmit-playground-2020.s3.us-east-1.amazonaws.com/backgrounds/%PATH%';

class Game extends Page {
  constructor() {
    super();

    if (!this.loaded) {
      document.getElementById('game').appendChild(createLoadingScreen());
    }
  }

  start = () => {
    if (!window.WebSocket) {
      // TODO: Handle error -- tell people their browser is incompatible
    }

    // Quick check for auth data
    if (localStorage.getItem('token') !== null) {
      document.getElementById('login-panel').style.display = 'none';
    } else {
      this.stopLoading();
    }

    this.scene = new Scene();

    this.characterId = null;
    this.characters = new Map();
    this.elements = [];
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
    this.addClickListener('settings-button', this.handleSettingsButton);
    this.addClickListener('game', this.handleGameClick);
    this.addClickListener('sponsor-login-button', this.handleSponsorLogin);
    this.addClickListener('jukebox-button', this.handleJukeboxButton);
    this.addClickListener('friends-button', this.handleFriendsButton);
    this.addClickListener('send-button', this.handleSendButton);
    this.addClickListener('igloo-button', this.handleIglooButton);

    this.handleWindowSize();

    socket.onopen = this.handleSocketOpen;
    socket.subscribe('*', this.handleSocketMessage);
    socket.start();

    // Start sending chat events
    const chatElem = document.getElementById('chat-box');

    chatElem.addEventListener('keydown', (e) => {
      // i hate javascript
      if (
        e.keyCode === 8 || // backspace key
        e.keyCode === 13 || // enter key
        e.keyCode === 16 || // shift key
        e.keyCode === 17 || // ctrl key
        e.keyCode === 18 || // option key
        (e.keyCode >= 37 && e.keyCode <= 40) || // arrow keys
        e.keyCode === 46 || // delete key
        e.keyCode === 91 || // cmd key
        e.keyCode === 93 // right cmd key
      ) {
        return;
      }

      // TODO: Get this value from config
      if (e.target.value.length >= 400) {
        e.preventDefault();
      }
    });

    chatElem.addEventListener('input', (e) => {
      // Replace non-ASCII characters
      // TODO: Get this value from config
      chatElem.value = chatElem.value.substring(0, 400);
      chatElem.value = chatElem.value.replace(/[^ -~]/gi, '');

      const lengthElem = document.getElementById('chat-length-indicator');

      // TODO: Add this value to a config
      if (e.target.value.length >= 200) {
        if (lengthElem.classList.contains('invisible')) {
          lengthElem.classList.remove('invisible');
        }

        // TODO: Add this value to a config
        lengthElem.innerText = `${e.target.value.length} / 400`;
      } else if (!lengthElem.classList.contains('invisible')) {
        lengthElem.classList.add('invisible');
      }
    });

    chatElem.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.handleSendButton();
      }
    });

    window.addEventListener('resize', () => {
      this.scene.fixCameraOnResize();
      this.handleWindowSize();
    });
  };

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

    socket.send({
      x,
      y,
      type: 'move',
    });
  };

  handleSocketOpen = () => {
    const joinPacket = {
      type: 'join',
    };

    if (window.location.hash.length > 1) {
      joinPacket.quillToken = document.location.hash.substring(1);
    } else if (localStorage.getItem('token') !== null) {
      joinPacket.token = localStorage.getItem('token');
    } else {
      // No auth data
      return;
    }

    // Connected to remote
    socket.send(joinPacket);
  };

  handleSocketMessage = (data) => {
    console.log(data);
    if (data.type === 'init') {
      this.characterId = data.character.id;

      if (data.token !== undefined) {
        localStorage.setItem('token', data.token);
        window.history.pushState(null, null, ' ');
        document.getElementById('login-panel').style.display = 'none';
      }

      // Delete stuff from previous room
      this.scene.deleteAllCharacters();

      this.elements.forEach((element) => {
        element.remove();
      });

      this.elements = [];

      this.hallways.forEach((hallway) => {
        console.log(hallway);
        hallway.remove();
      });

      this.hallways = new Map();

      Object.entries(data.room.characters).forEach(([id, character]) => {
        this.scene.newCharacter(id, character.name, character.x, character.y);
        this.characters.set(id, character);
      });

      this.elementNames = data.elementNames;
      this.roomNames = data.roomNames;

      Object.entries(data.room.elements).forEach(([id, element]) => {
        const elementElem = new Element(element, id, data.elementNames);
        this.elements.push(elementElem);

        if (element.action > 0) {
          document.getElementById('game').appendChild(elementElem.element);
        } else {
          document
            .getElementById('game')
            .insertBefore(
              elementElem.element,
              document.getElementById('three-container')
            );
        }
      });

      Object.entries(data.room.hallways).forEach(([id, hallway]) => {
        this.hallways.set(id, new Hallway(hallway, id, data.roomNames));
        document
          .getElementById('game')
          .appendChild(this.hallways.get(id).element);
      });

      this.settings = data.settings;
      this.room = data.room;

      if (this.room.sponsor) {
        document.getElementById('sponsor-pane').classList.add('active');
        document.getElementById(
          'sponsor-name'
        ).innerHTML = `<span>${this.room.slug}</span>${this.room.slug}`;
        document.getElementById('outer').classList.add('sponsor');
        document.getElementById('game').classList.add('sponsor');
      } else {
        document.getElementById('sponsor-pane').classList.remove('active');
        document.getElementById('outer').classList.remove('sponsor');
        document.getElementById('game').classList.remove('sponsor');
      }

      const img = new Image();

      img.onload = () => {
        this.loaded = true;

        document.getElementById('background').src = img.src;
        this.stopLoading();
      };

      img.src = BACKGROUND_IMAGE_URL.replace('%PATH%', this.room.background);

      this.scene.fixCameraOnResize();
    } else if (data.type === 'move') {
      this.scene.moveCharacter(data.id, data.x, data.y, () => {
        if (data.id !== this.characterId) {
          return;
        }

        Array.from(this.hallways.values()).some((hallway) => {
          const distance = Math.sqrt(
            (hallway.data.x - data.x) ** 2 + (hallway.data.y - data.y) ** 2
          );

          if (distance <= hallway.data.radius) {
            // TODO: We shouldn't need the 'from' attribute in the teleport packet
            socket.send({
              type: 'teleport',
              from: this.room.slug,
              to: hallway.data.to,
            });

            return true;
          }

          return false;
        });
      });
    } else if (data.type === 'element_add') {
      const element = new Element(data.element, data.id, this.elementNames);
      document.getElementById('game').appendChild(element.element);
      this.elements.push(element);
      // } else if (data.type === 'element_delete') {
      //   this.elements.get(data.id).remove();
      //   this.elements.delete(data.id);
    } else if (data.type === 'element_update') {
      const idx = this.elements.findIndex((elem) => elem.id === data.id);
      this.elements[idx].applyUpdate(data.element);
    } else if (data.type === 'hallway_add') {
      this.hallways.set(
        data.id,
        new Hallway(data.hallway, data.id, this.roomNames)
      );
      document
        .getElementById('game')
        .appendChild(this.hallways.get(data.id).element);
    } else if (data.type === 'hallway_delete') {
      this.hallways.get(data.id).remove();
      this.hallways.delete(data.id);
    } else if (data.type === 'hallway_update') {
      this.hallways.get(data.id).applyUpdate(data.hallway);
    } else if (data.type === 'room_add') {
      socket.send({
        type: 'teleport',
        from: this.room.slug,
        to: data.id,
      });
    } else if (data.type === 'error') {
      if (data.code === 1) {
        this.stopLoading();
        document.getElementById('login-panel').style.display = 'block';
      }
    } else if (data.type === 'join') {
      this.scene.newCharacter(
        data.character.id,
        data.character.name,
        data.character.x,
        data.character.y
      );
    } else if (data.type === 'leave') {
      if (data.character.id === this.characterId) {
        return;
      }
      this.scene.deleteCharacter(data.character.id);
    } else if (data.type === 'chat') {
      this.scene.sendChat(data.id, data.mssg);
    } else {
      console.log(`received unknown packet: ${data.type}`);
      console.log(data);
    }
  };

  handleDayofButton = () => {
    createModal(
      <iframe
        id="day-of-iframe"
        className="day-of-page"
        src="https://dayof.hackmit.org"
      />
    );
  };

  handleElementAddButton = () => {
    socket.send({
      type: 'element_add',
      element: {
        x: 0.2,
        y: 0.2,
        path: 'lamp.svg',
        width: 0.1,
      },
    });
  };

  handleHallwayAddButton = () => {
    socket.send({
      type: 'hallway_add',
      hallway: {
        x: 0.2,
        y: 0.2,
        radius: 0.1,
        to: 'microsoft',
      },
    });
  };

  handleRoomAddButton = () => {
    const roomName = prompt('What should the room be called?');
    const backgroundPath = prompt("What's this room's background path?");
    const sponsor = prompt("Type 'true' if this is a sponsor room").includes(
      'true'
    );

    socket.send({
      type: 'room_add',
      id: roomName,
      background: backgroundPath,
      sponsor,
    });
  };

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
  };

  handleSettingsButton = () => {
    createModal(settings.createSettingsModal(this.settings));
  };

  handleJukeboxButton = () => {
    jukebox.openJukeboxPane(document.body);
  };

  handleFriendsButton = () => {
    if (this.friendsPaneVisible === true) {
      // Hide the friends pane
      document.getElementById('friends-pane').classList.add('invisible');
      this.friendsPaneVisible = false;
    } else if (this.friendsPaneVisible === false) {
      // Make the friends pane visible
      document.getElementById('friends-pane').classList.remove('invisible');
      this.friendsPaneVisible = true;
    } else {
      // Never created friends pane before, create it now
      document
        .getElementById('chat')
        .appendChild(friends.createFriendsPane(this.characters));
      this.friendsPaneVisible = true;
    }
  };

  handleSendButton = () => {
    const chatElem = document.getElementById('chat-box');
    const lengthElem = document.getElementById('chat-length-indicator');

    // TODO: Get this value from config
    if (chatElem.value.length >= 400) {
      return;
    }

    // Replace all non-ASCII characters
    chatElem.value = chatElem.value.replace(/[^ -~]/gi, '');

    socket.send({
      type: 'chat',
      mssg: chatElem.value,
    });

    chatElem.value = '';

    if (!lengthElem.classList.contains('invisible')) {
      lengthElem.classList.add('invisible');
    }
  };

  handleIglooButton = () => {
    socket.send({
      type: 'teleport_home',
    });
  };

  handleSponsorLogin = () => {
    const joinPacket = {
      type: 'join',
      name: prompt("What's your name?"),
    };

    // Connected to remote
    socket.send(joinPacket);
  };

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
  };

  stopLoading = () => {
    const loadingElem = document.getElementById('loading');

    if (loadingElem === null) {
      return;
    }

    loadingElem.classList.add('closing');

    setTimeout(() => {
      loadingElem.remove();
    }, 250);
  };
}

const gamePage = new Game();
window.onload = gamePage.start;
