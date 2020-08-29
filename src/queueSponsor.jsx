import socket from './js/socket';

// eslint-disable-next-line
import createElement from './utils/jsxHelper';

class QueueSponsor {
  constructor() {
    this.currentQueue = null;
    this.subscribed = false;
    socket.subscribe(['queue_pop', 'queue_push', 'queue_remove', 'queue_subscribe'],
      this.handleSocketMessage);
  }

  updateQueueContent = () => {
    const queueList = document.getElementById('queue-sponsor-list');
    if (queueList !== null) {
      queueList.innerHTML = '';
      queueList.appendChild(this.createQueueContent());
    }
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

  handleQueuePop = () => {
    const queuePop = {
      type: 'queue_pop',
      sponsorId: "macrosoft"
    };
    socket.send(queuePop);
  };

  createQueueContent = () => {
    const hackers = document.createElement('table');
    for (let i = 0; i < Math.min(10, this.currentQueue.length); i += 1) {
      const row = document.createElement('tr');
      const hacker = document.createElement('th');
      hacker.innerHTML = this.currentQueue[i].name;
      row.appendChild(hacker);
      hackers.appendChild(row);
    }

    if (this.currentQueue.length > 10) {
      const row = document.createElement('tr');
      const hacker = document.createElement('th');
      hacker.innerHTML = `And ${this.currentQueue.length - 10} more ...`;
      row.appendChild(hacker);
      hackers.appendChild(row);
    }

    return (
      <div id="settings-text">
        <div id="settings-option">
          <button id="settings-button" onclick={this.handleQueuePop}>
            Next Hacker
          </button>
        </div>
        <div id="settings-option">
          {hackers}
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
            <div class="queue-sponsor-list" id="queue-sponsor-list">
              <div id="settings-text">
              </div>
            </div>
          </div>
          <div id="settings-clouds"></div>
        </div>
      );
    }
    return (
      <div id="settings">
        <div id="root">
          <div class="settings-header" id="settings-header">
            <h1>Sponsor</h1>
          </div>
          <div class="queue-sponsor-list" id="queue-sponsor-list">
            {this.createQueueContent()}
          </div>
        </div>
        <div id="settings-clouds"></div>
      </div>
    );
  };

  onClose = () => {
    this.unsubscribe();
  };

}

const queueSponsorInstance = new QueueSponsor();
export default queueSponsorInstance;
