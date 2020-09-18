import hotkeys from 'hotkeys-js';
import isMobile from 'ismobilejs';

import Scene from './js/scene';
import Element from './js/element';
import Hallway from './js/hallway';
import Page from './js/page';
import socket from './js/socket';
import createModal from './modal';
import settings from './settings.jsx';
import map from './js/components/map';
import feedback from './feedback.jsx';
import queueSponsor from './js/components/sponsorPanel';
import adminPanel from './js/components/adminPanel';
import projectForm from './js/components/projectForm';
import friends from './js/components/friends';
import dance from './js/components/dance';
import jukebox from './jukebox';
import loginPanel from './js/components/login';
import createLoadingScreen from './js/components/loading';
import characterSelector from './js/components/characterSelector';
import queueForm from './js/components/queueForm';

import characterManager from './js/managers/character';
import notificationsManager from './js/managers/notifications';
import queueManager from './js/managers/queue';
import constants from './constants';

// eslint-disable-next-line
import statusManager from './js/managers/status';

import './styles/index.scss';
import './styles/notifications.scss';
import './styles/sponsor.scss';
import './images/Code_Icon.svg';
import './images/Coffee_Icon.svg';
import './images/Site_Icon.svg';
import './images/sponsor_text.svg';

import './images/icons/megaphone.svg';
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
import './images/icons/map.svg';
import './images/icons/guidebook.svg';
import './images/icons/schedule.svg';
import './images/logo.png';
import './images/swoopy.svg';
import './images/icons/dab.svg';
import './images/icons/wave.svg';
import './images/icons/floss.svg';
import './images/icons/exclamation.svg';

// eslint-disable-next-line
import createElement from './utils/jsxHelper';

const BACKGROUND_IMAGE_URL =
  'https://hackmit-playground-2020.s3.us-east-1.amazonaws.com/backgrounds/%PATH%';
const SPONSOR_NAME_IMAGE_URL =
  'https://hackmit-playground-2020.s3.us-east-1.amazonaws.com/sponsors/%PATH%.svg';

class Game extends Page {
  constructor() {
    super();

    if (!this.loaded) {
      this.startLoading();
    }
  }

  start = () => {
    document.getElementById('top-bar-button-container').style.display = 'none';
    document.getElementById('chat').style.display = 'none';

    if (isMobile(window.navigator).any || !window.WebSocket) {
      this.stopLoading();
      loginPanel.hide();
      document.getElementById('top-bar-button-container').style.display =
        'flex';
      document.getElementById('chat').style.display = 'flex';
      document.getElementById('outer').innerHTML =
        '<div id="unsupported">Unsupported device or browser</div>';
      return;
    }

    loginPanel.update();

    // Quick check for auth data
    if (localStorage.getItem('token') !== null) {
      loginPanel.hide();
      document.getElementById('top-bar-button-container').style.display =
        'flex';
      document.getElementById('chat').style.display = 'flex';
    } else {
      this.stopLoading();
    }

    this.scene = new Scene();

    this.characterId = null;
    this.characters = new Map();
    this.elements = [];
    this.hallways = new Map();
    this.loadingTasks = 0;
    this.room = null;

    this.editing = false;
    this.elementNames = [];
    this.roomNames = [];

    this.buildingIntervals = [];

    this.addClickListener('add-button', this.handleElementAddButton);
    this.addClickListener('add-hallway-button', this.handleHallwayAddButton);
    this.addClickListener('add-room-button', this.handleRoomAddButton);
    this.addClickListener('day-of-button', this.handleDayofButton);
    this.addClickListener('edit-button', this.handleEditButton);
    this.addClickListener('settings-button', this.handleSettingsButton);
    this.addClickListener('game', this.handleGameClick);
    this.addClickListener('jukebox-button', this.handleJukeboxButton);
    this.addClickListener('friends-button', this.handleFriendsButton);
    this.addClickListener('send-button', this.handleSendButton);
    this.addClickListener('igloo-button', this.handleIglooButton);
    this.addClickListener('dance-button', this.handleDanceButton);
    this.addClickListener('map-button', this.handleMapButton);
    this.addClickListener('queue-button', this.handleQueueButton);
    this.addClickListener('website-button', this.handleWebsiteButton);
    this.addClickListener('schedule-button', this.handleScheduleButton);
    this.addClickListener('form-button', this.handleFormButton);
    this.addClickListener('challenges-button', this.handleChallengesButton);
    this.addClickListener('top-bar-logo', () => {
      socket.send({
        type: 'teleport',
        to: 'home',
      });
    });
    this.addClickListener('connectivity-button', () =>
      this.handleArenaButton('connectivity')
    );
    this.addClickListener('education-button', () =>
      this.handleArenaButton('education')
    );
    this.addClickListener('healthtech-button', () =>
      this.handleArenaButton('health')
    );
    this.addClickListener('urbaninnovation-button', () =>
      this.handleArenaButton('urban')
    );

    socket.onopen = this.handleSocketOpen;
    socket.onclose = this.handleSocketClose;
    socket.subscribe('*', this.handleSocketMessage);
    socket.start();

    queueManager.start();

    // Listen for hotkeys
    hotkeys('t, enter, /', (e) => {
      e.preventDefault();
      document.getElementById('chat-box').focus();
    });

    hotkeys('esc', () => {
      // Close all character profiles
      Array.from(document.getElementsByClassName('profile-container')).forEach(
        (elem) => {
          elem.style.visibility = 'hidden';
        }
      );
    });

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

    window.onclick = (e) => {
      if (e.target.id === 'modal-background') {
        document.getElementById('modal-background').remove();
      } else if (e.target.id === 'form-modal-background') {
        document.getElementById('form-modal-background').remove();
      }
    };
  };

  handleGameClick = (e) => {
    // When clicking on the page, send a move message to the server
    if (
      (e.target.id !== 'three-canvas' &&
        !e.target.classList.contains('element-img')) ||
      e.target.hasAttribute('data-interactable')
    ) {
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

    const rect = document
      .getElementById('three-canvas')
      .getBoundingClientRect();
    const x = (e.clientX - rect.x) / rect.width;
    const y = (e.clientY - rect.y) / rect.height;

    // call click handler of game to check for characters clicked
    const success = this.scene.handleClickEvent(x, y);

    if (success) {
      // If we click on a character, don't move
      return;
    }

    // Send move packet
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
      window.history.replaceState({}, document.title, '.');
    } else if (localStorage.getItem('token') !== null) {
      joinPacket.token = localStorage.getItem('token');
    } else {
      // No auth data
      return;
    }

    // Connected to remote
    socket.send(joinPacket);
  };

  handleSocketClose = () => {
    notificationsManager.displayMessage(
      "You've been disconnected from the HackMIT playground. Please refresh the page to try to reconnect.",
      30000
    );
  };

  handleSocketMessage = (data) => {
    console.log(data);
    if (data.type === 'init') {
      if (data.firstTime) {
        // If firstTime is true, components/login.js is handling this
        this.stopLoading();
        loginPanel.show(true);
        return;
      }

      this.characterId = data.character.id;

      if (data.token !== undefined) {
        localStorage.setItem('token', data.token);
        window.history.pushState(null, null, ' ');

        loginPanel.hide();
        document.getElementById('top-bar-button-container').style.display =
          'flex';
        document.getElementById('chat').style.display = 'flex';
      }

      // Delete stuff from previous room
      this.scene.deleteAllCharacters();
      this.scene.removeAllBuildings();
      this.buildingIntervals.forEach((interval) => {
        clearInterval(interval);
      });
      this.elements.forEach((element) => {
        element.remove();
      });

      this.elements = [];

      this.hallways.forEach((hallway) => {
        hallway.remove();
      });

      this.hallways = new Map();

      Object.entries(data.room.characters).forEach(([id, character]) => {
        this.scene.newCharacter(id, character);
        this.characters.set(id, character);
      });

      this.elementNames = data.elementNames;
      this.roomNames = data.roomNames;

      data.room.elements.forEach((element) => {
        this.loadingTasks += 1;

        const elementElem = new Element(element, element.id, data.elementNames);
        this.elements.push(elementElem);
        const gameRect = document
          .getElementById('game')
          .getBoundingClientRect();

        elementElem.onload = () => {
          this.convertElementTo3d(elementElem, gameRect, () =>
            this.finishedLoadingPart()
          );
          elementElem.element.style.opacity = 0;
        };

        const threeContainer = document.getElementById('three-container');

        if (element.action > 0) {
          threeContainer.appendChild(elementElem.element);
        } else {
          threeContainer.insertBefore(
            elementElem.element,
            document.getElementById('three-canvas')
          );
        }
      });

      Object.entries(data.room.hallways).forEach(([id, hallway]) => {
        this.hallways.set(id, new Hallway(hallway, id, data.roomNames));

        document
          .getElementById('game')
          .appendChild(this.hallways.get(id).element);
      });

      if (data.openFeedback) {
        this.showFeedback();
      }

      this.settings = data.settings;
      this.room = data.room;

      if (this.room.sponsorId.length > 0) {
        if (characterManager.character.queueId !== this.room.sponsorId.length) {
          document.getElementById('queue-button-icon').src =
            './images/Coffee_Icon.svg';
        }
        document.getElementById('sponsor-pane').classList.add('active');
        document.getElementById(
          'sponsor-name'
        ).innerHTML = `<span>${this.room.slug}</span>${this.room.slug}`;
        document.getElementById('outer').classList.add('sponsor');
        document.getElementById('game').classList.add('sponsor');

        document.getElementById('challenges-button').style.display =
          this.room.sponsor.challenges.length > 0 ? 'inline-block' : 'none';

        const text = this.room.sponsor.description.replace(
          /(https?:\/\/[^\s]+)/g,
          '<a href=\'$1\' target="_blank">$1</a>'
        );
        document.getElementById('sponsor-description').innerHTML = text;
        document.getElementById(
          'queue-button-text'
        ).innerText = `Talk to ${this.room.sponsor.name}`;

        document.getElementById(
          'sponsor-name'
        ).src = SPONSOR_NAME_IMAGE_URL.replace('%PATH%', this.room.sponsorId);
      } else {
        document.getElementById('sponsor-pane').classList.remove('active');
        document.getElementById('outer').classList.remove('sponsor');
        document.getElementById('game').classList.remove('sponsor');
      }

      if (this.dancePaneVisible) {
        // Hide the dance pane
        document.getElementById('dance-pane').classList.add('invisible');
        this.dancePaneVisible = false;
      }

      if (this.friendsPaneVisible) {
        // Hide the friends pane
        document.getElementById('friends-pane').classList.add('invisible');
        this.friendsPaneVisible = false;
      }

      // Close all character profiles
      Array.from(document.getElementsByClassName('profile-container')).forEach(
        (elem) => {
          elem.style.visibility = 'hidden';
        }
      );

      this.loadingTasks += 1;
      const img = new Image();

      img.onload = () => {
        this.loaded = true;

        document.getElementById('background').src = img.src;
        this.finishedLoadingPart();
      };

      img.src = BACKGROUND_IMAGE_URL.replace('%PATH%', this.room.background);

      // Start managers
      notificationsManager.start();

      if (data.character.shirtColor === '#d6e2f8') {
        createModal(characterSelector.createModal());
      }

      document.getElementById('form-button').style.display = 'none';
      document.getElementById('edit-button').style.display = 'none';

      //  organizer
      if (characterManager.character.role === 1) {
        document.getElementById('edit-button').style.display = 'block';
      }
      //  sponsor
      else if (
        characterManager.character.role === 4 &&
        !characterManager.character.project
      ) {
        const currentTime = new Date().getTime();
        const formOpen1 = this.createUTCDate(19, 1);
        const deadline1 = this.createUTCDate(19, 7);

        const formOpen2 = this.createUTCDate(19, 16);
        const deadline2 = this.createUTCDate(19, 22);

        const first =
          formOpen1.getTime() < currentTime &&
          currentTime < deadline1.getTime();
        const second =
          formOpen2.getTime() < currentTime &&
          currentTime < deadline2.getTime();

        let formName = '';
        let due = '';
        if (first) {
          formName = 'Fun Friday Form';
          due = 'Saturday 3am EDT';
        } else {
          formName = 'Spicy Saturday Survey';
          due = 'Saturday 6pm EDT';
        }

        if (first || second) {
          document.getElementById('form-button').style.display = 'block';
          if (!this.remindForm) {
            createModal(
              <div id="form-reminder-modal">
                <div id="form-reminder">
                  <h1>Reminder: </h1>
                  You must submit the <b>{formName}</b> in order to be eligible
                  for judging and swag! Please fill this out by <b>{due}</b> at
                  the latest by clicking the exclamation mark at the top right
                  of your screen.
                </div>
                <div id="form-button-div">
                  <button
                    id="later-button"
                    onclick={() => {
                      document.getElementById('form-reminder-modal').remove();
                      document.getElementById('form-modal-background').remove();
                    }}
                  >
                    Later
                  </button>
                  <button
                    onclick={() => {
                      document.getElementById('form-reminder-modal').remove();
                      document.getElementById('form-modal-background').remove();
                      createModal(projectForm.createFormModal());
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>,
              'form'
            );
            this.remindForm = true;
          }
        }
      }

      // Resize appropriately if we're in a sponsor room
      this.handleWindowSize();

      // Show floor selector inside hacker arena
      if (this.room.id.startsWith('arena:')) {
        document.getElementById('floor-selector').style.display = 'block';
      } else {
        document.getElementById('floor-selector').style.display = 'none';
      }
    } else if (data.type === 'dance') {
      this.scene.danceCharacter(data.id, data.dance);
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
            this.startLoading();

            socket.send({
              type: 'teleport',
              to: hallway.data.to,
              x: hallway.data.toX,
              y: hallway.data.toY,
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
      this.scene.updateElement(this.elements[idx]);
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
        to: data.id,
      });
    } else if (data.type === 'error') {
      if (data.code === 1) {
        this.stopLoading();
        loginPanel.show();
      }
      if (data.code === 2) {
        this.stopLoading();
        createModal(
          <div id="jukebox-modal">
            <h1 className="white-text">Oops!</h1>
            <p className="white-text">
              You must be a college student to enter the nightclub.
            </p>
          </div>
        );
      }
      if (data.code === 4) {
        createModal(
          <div id="jukebox-modal">
            <h1 className="white-text">Oops!</h1>
            <p className="white-text">
              You must be a college student to enter a sponsor queue.
            </p>
          </div>
        );
      }
    } else if (data.type === 'join') {
      this.scene.newCharacter(data.character.id, data.character);
    } else if (data.type === 'leave') {
      if (data.character.id === this.characterId) {
        return;
      }
      this.scene.deleteCharacter(data.character.id);
    } else if (data.type === 'chat') {
      this.scene.sendChat(data.id, data.mssg);
    } else if (data.type === 'wardrobe_change') {
      this.scene.updateClothes(data.characterId, data);
    }
  };

  createUTCDate = (day, hour) => {
    const date = new Date();
    date.setUTCFullYear(2020, 8, day);
    date.setUTCHours(hour, 0, 0);
    return date;
  };

  handleDayofButton = () => {
    createModal(
      <div id="day-of-div">
        <iframe
          id="day-of-iframe"
          className="modal-frame"
          src="https://dayof.hackmit.org"
        />
      </div>
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

      this.elementsTo3d();

      this.elements.forEach((element) => {
        element.makeUneditable();
      });

      this.hallways.forEach((hallway) => {
        hallway.makeUneditable();
      });
    }
  };

  elementsTo3d = () => {
    // make everything into an actual object in 3d
    const gameRect = document.getElementById('game').getBoundingClientRect();

    this.elements.forEach((element) => {
      this.convertElementTo3d(element, gameRect, () => {});
    });

    this.elements.forEach((element) => {
      element.element.remove();
    });
  };

  convertElementTo3d = (element, gameRect, callback) => {
    const request = new XMLHttpRequest();
    request.addEventListener(
      'load',
      this.makeSceneRequestFunc(gameRect, element, callback)
    );
    request.overrideMimeType('image/svg+xml');
    request.open('GET', element.imagePath);
    request.send();
  };

  handleArenaButton = (id) => {
    socket.send({
      type: 'teleport',
      to: `arena:${id}`,
      x: 0.6007,
      y: 0.6905,
    });
  };

  handleFormButton = () => {
    createModal(projectForm.createFormModal());
  };

  handleSettingsButton = () => {
    if (characterManager.character.role === 2) {
      createModal(
        queueSponsor.createQueueModal(),
        'queue',
        queueSponsor.onClose
      );
      queueSponsor.subscribe(characterManager.character.sponsorId);
    } else if (characterManager.character.role === 1) {
      createModal(adminPanel.createAdminModal(), '', adminPanel.onClose);
    } else {
      createModal(settings.createSettingsModal(this.settings));
    }
  };

  handleQueueButton = () => {
    // TODO: 2 should be a constant for sponsor
    if (characterManager.character.role === 2) {
      createModal(
        queueSponsor.createQueueModal(),
        'queue',
        queueSponsor.onClose
      );

      queueSponsor.subscribe(this.room.sponsor.id);
    } else if (queueManager.inQueue()) {
      queueManager.join(this.room.sponsor);
    } else if (
      characterManager.character.queueId !== '' &&
      characterManager.character.queueId !== this.room.sponsor.id
    ) {
      createModal(
        <div id="other-queue-modal">
          <h1>Confirm:</h1>
          <p>
            You are currently in the queue for{' '}
            {characterManager.character.queueId}, would you like to leave and
            join this queue instead?
          </p>
          <div id="queue-button-div">
            <button
              id="no-button"
              onclick={() => {
                document.getElementById('modal-background').remove();
              }}
            >
              No
            </button>
            <button
              onclick={() => {
                document.getElementById('modal-background').remove();
                socket.send({
                  type: 'queue_remove',
                  characterId: characterManager.character.id,
                  sponsorId: this.room.sponsor.id,
                });
                createModal(queueForm.createQueueModal(this.room.sponsor));
              }}
            >
              OK
            </button>
          </div>
        </div>
      );
    } else {
      createModal(queueForm.createQueueModal(this.room.sponsor));
    }
  };

  handleChallengesButton = () => {
    createModal(
      <div id="challenges-modal">
        <div id="challenges-content">
          <h1>{this.room.sponsor.name} Challenges</h1>
          <div id="challenge-text"></div>
        </div>
      </div>
    );
    const text = this.room.sponsor.challenges.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href=\'$1\' target="_blank">$1</a>'
    );
    document.getElementById('challenge-text').innerHTML = text;
  };

  handleWebsiteButton = () => {
    window.open(this.room.sponsor.url, '_blank');
  };

  handleScheduleButton = () => {
    window.open(constants.calendarURL, '_blank');
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

      // Hide the dance pane
      document.getElementById('dance-pane').classList.add('invisible');
      this.dancePaneVisible = false;
    } else {
      // Never created friends pane before, create it now
      document
        .getElementById('chat')
        .appendChild(friends.createFriendsPane(this.friends));
      this.friendsPaneVisible = true;

      // Hide the dance pane
      document.getElementById('dance-pane').classList.add('invisible');
      this.dancePaneVisible = false;
    }
  };

  handleSendButton = () => {
    const chatElem = document.getElementById('chat-box');
    const lengthElem = document.getElementById('chat-length-indicator');

    // TODO: Get this value from config
    if (chatElem.value.length >= 400 || chatElem.value.length === 0) {
      return;
    }

    // Replace all non-ASCII characters
    chatElem.value = chatElem.value.replace(/[^ -~]/gi, '');

    // Check if chat contains any covid-related words
    const pattern = new RegExp(
      /(\s|^)(sick|achoo|sneeze|fever|sick|asymptomatic|symptoms)(\s|$|[.!?\\-])/i
    );
    const matches = chatElem.value.match(pattern);

    if (matches) {
      socket.send({ type: 'teleport_home' });
      createModal(
        <div id="quarantine-modal">
          <h1 className="white-text">Welcome Home!</h1>
          <p className="white-text">
            You have been placed in quarantine for saying '{chatElem.value}'.
          </p>
        </div>,
        'quarantine'
      );
      chatElem.value = '';
      return;
    }

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
    this.startLoading();

    socket.send({
      type: 'teleport_home',
    });
  };

  handleDanceButton = () => {
    if (this.dancePaneVisible === true) {
      // Hide the dance pane
      document.getElementById('dance-pane').classList.add('invisible');
      this.dancePaneVisible = false;
    } else if (this.dancePaneVisible === false) {
      // make the dance pane visible
      document.getElementById('dance-pane').classList.remove('invisible');
      this.dancePaneVisible = true;

      //  make friends pane invisible
      document.getElementById('friends-pane').classList.add('invisible');
      this.friendsPaneVisible = false;
    } else {
      // Never created dance pane before, create it now
      document.getElementById('chat').appendChild(dance.createDancePane());
      this.dancePaneVisible = true;

      // Hide the friends pane
      document.getElementById('friends-pane').classList.add('invisible');
      this.friendsPaneVisible = false;
    }
  };

  handleMapButton = () => {
    createModal(map.createMapModal());
  };

  handleWindowSize = () => {
    const outerElem = document.getElementById('outer');

    let width = window.innerWidth;

    if (this.room !== null && this.room.sponsorId.length > 0) {
      width -= 340 + 24 * 3;
    }

    if (width < (window.innerHeight - (52 + 64)) * (16 / 9)) {
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

    this.scene.fixCameraOnResize();
  };

  showFeedback = () => {
    createModal(feedback.createFeedbackModal());
  };

  startLoading = () => {
    document.getElementById('game').appendChild(createLoadingScreen());
  };

  stopLoading = () => {
    this.loadingTasks = 1;
    this.finishedLoadingPart();
  };

  finishedLoadingPart = () => {
    this.loadingTasks -= 1;

    if (this.loadingTasks > 0) {
      return;
    }

    const loadingElem = document.getElementById('loading');

    if (loadingElem === null) {
      return;
    }

    loadingElem.classList.add('closing');

    setTimeout(() => {
      loadingElem.remove();
    }, 250);
  };

  makeSceneRequestFunc = (gameRect, element, callback) => {
    return (data) => {
      console.log(element);

      let basebb = null;
      let customShift = 0;

      const svg = data.target.responseXML;
      let baseElem = svg.getElementById('base');
      if (baseElem === null) {
        baseElem = svg.getElementById('Base');
      }

      const viewbox = svg.firstElementChild
        .getAttribute('viewBox')
        .split(' ')
        .map((num) => parseFloat(num));
      const aspect = viewbox[2] / viewbox[3];

      const bb = {
        x: element.data.x,
        y: element.data.y,
        width: element.data.width,
        height:
          (element.data.width / aspect) * (gameRect.width / gameRect.height),
      };

      if (
        baseElem !== null &&
        baseElem.firstElementChild.getAttribute('points') !== null
      ) {
        console.log(baseElem);
        const base = baseElem.firstElementChild
          .getAttribute('points')
          .trim()
          .split(',')
          .join(' ')
          .split(' ')
          .map((num) => parseFloat(num));
        // these are coordinates w/ y=0 at top and y=1 at bottom
        const scaledBaseYs = base
          .filter((el, i) => i % 2 === 1)
          .map((y) => y / viewbox[3]);
        const scaledBaseXs = base
          .filter((el, i) => i % 2 === 0)
          .map((x) => x / viewbox[2]);

        const minY = Math.min.apply(null, scaledBaseYs);
        const maxY = Math.max.apply(null, scaledBaseYs);

        const minX = Math.min.apply(null, scaledBaseXs);
        const maxX = Math.max.apply(null, scaledBaseXs);

        const leftY = scaledBaseYs[scaledBaseXs.indexOf(minX)];
        const rightY = scaledBaseYs[scaledBaseXs.indexOf(maxX)];

        // we essentially shift the point where we draw it up by this amount (but also shift center pt "back")
        basebb = {
          bottom: maxY,
          top: minY,
          left: minX,
          right: maxX,
          leftY,
          rightY,
        };
      } else if (element.data.path.slice(0, 5) === 'tiles') {
        customShift = 1;
      }

      this.scene.create2DObject(
        bb,
        element.imagePath,
        basebb,
        element,
        customShift,
        callback
      );

      if (element.data.changingImagePath) {
        const stateLen = element.data.changingPaths.split(',').length;
        const interval = setInterval(() => {
          if (element.data.changingRandomly) {
            element.data.state = Math.floor(
              Math.random() * Math.floor(stateLen)
            );
          } else {
            element.data.state = (element.data.state + 1) % stateLen;
          }
          element.setImageForState();
          this.scene.updateBuildingImage(element.data.id);
        }, element.data.changingInterval);
        this.buildingIntervals.push(interval);
      }
    };
  };
}

const gamePage = new Game();
window.onload = gamePage.start;
