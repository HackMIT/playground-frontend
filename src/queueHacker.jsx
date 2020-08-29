import socket from './js/socket';
import characterManager from './js/managers/character';

// eslint-disable-next-line
import createElement from './utils/jsxHelper';

class QueueHacker {
  constructor() {
    this.currentQueue = null;
    this.subscribed = false;
    socket.subscribe(['queue_pop', 'queue_push', 'queue_remove', 'queue_subscribe'],
      this.handleSocketMessage);
  }

  updateQueueContent = () => {
    const queueList = document.getElementById('queue-hacker-list');
    queueList.innerHTML = '';
    queueList.appendChild(this.createQueueContent());
  };

  handleSocketMessage = (msg) => {
    if (this.subscribed && msg.sponsorId === "macrosoft") {
      if (msg.type === 'queue_pop') {
        if (this.currentQueue.length > 0) {
          this.currentQueue.shift()
        }
      } else if (msg.type === 'queue_push') {
        this.currentQueue.push(msg.character)
      } else if (msg.type === 'queue_remove') {
        let index = -1
        for (let i = 0; i < this.currentQueue.length; i += 1) {
          if (this.currentQueue[i].id === msg.characterId) index = i
        }
        if (index !== -1) {
          this.currentQueue.splice(index, 1)
        }
      } else if (msg.type === 'queue_subscribe') {
        this.currentQueue = msg.characters
      }
      this.updateQueueContent();

    }
  }

  subscribe = () => {
    this.subscribed = true;
    const queueSubscribe = {
      type: 'queue_subscribe',
      sponsorId: "macrosoft"
    };
    socket.send(queueSubscribe);
  };

  unsubscribe = () => {
    this.subscribed = false;
    this.currentQueue = null;
    const queueUnsubscribe = {
      type: 'queue_unsubscribe',
      sponsorId: "macrosoft"
    };
    socket.send(queueUnsubscribe);
  };

  handleQueuePush = () => {
    const queuePush = {
      type: 'queue_push',
      sponsorId: "macrosoft"
    };
    socket.send(queuePush);
  };

  handleQueueRemove = () => {
    const queueRemove = {
      type: 'queue_remove',
      sponsorId: "macrosoft"
    };
    socket.send(queueRemove);
  };

  createQueueContent = () => {
    let position = -1
    for (let i = 0; i < this.currentQueue.length; i += 1) {
      if (this.currentQueue[i].id === characterManager.characterId) position = i
    }
    if (position === -1) {
      return (
        <div id="settings-text">
          <div id="settings-option">
            <button id="settings-button" onclick={this.handleQueuePush}>
              Join Queue
            </button>
          </div>
          <div id="settings-option">
            Length of hacker queue is currently {this.currentQueue.length}
          </div>
        </div>
      );
    }
    return (
      <div id="settings-text">
        <div id="settings-option">
          <button id="settings-button" onclick={this.handleQueueRemove}>
            Leave Queue
            </button>
        </div>
        <div id="settings-option">
          You are at position {position + 1} of the hacker queue
          </div>
      </div>
    );
  };

  createQueueModal = () => {
    this.subscribe();

    if (this.currentQueue === null) {
      return (
        <div id="settings">
          <div id="root">
            <div class="settings-header" id="settings-header">
              <h1>Sponsor</h1>
            </div>
            <div class="queue-hacker-list" id="queue-hacker-list">
              <div id="settings-text">
              </div>
            </div>
          </div>
          <div id="settings-clouds"></div>
        </div>
      );
    }
    return (
      <div id="sponsor">
        <div id="root">
          <div class="sponsor-header" id="sponsor-header">
            <h1>Sponsor</h1>
          </div>
          <div class="queue-hacker-list" id="queue-hacker-list">
            {this.createQueueContent()}
          </div>
        </div>
        <div id="sponsor-clouds"></div>
      </div>
    );
  };

  onClose = () => {
    this.unsubscribe();
  };

}

const queueHackerInstance = new QueueHacker();
export default queueHackerInstance;
