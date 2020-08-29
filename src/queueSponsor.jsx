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
    const queueList = document.getElementById('queue-list');
    queueList.innerHTML = '';
    queueList.appendChild(this.createQueueContent());
  };

  handleSocketMessage = (msg) => {
    if (this.subscribed && msg.sponsorId === "macrosoft") {
      if (msg.type === 'queue_pop') {
        console.log("received queue_pop")
      } else if (msg.type === 'queue_push') {
        console.log("received queue_push")
      } else if (msg.type === 'queue_remove') {
        console.log("received queue_remove")
      } else if (msg.type === 'queue_subscribe') {
        console.log("received queue_subscribe")
        this.currentQueue = msg.characters
      }
    }
    updateQueueContent();
  }

  subscribe = () => {
    this.subscribed = true;
    console.log("queue subscribe")
    const queueSubscribe = {
      type: 'queue_subscribe',
      sponsorId: "macrosoft"
    };
    socket.send(queueSubscribe);
  };

  unsubscribe = () => {
    this.subscribed = false;
    console.log("queue unsubscribe")
    const queueUnsubscribe = {
      type: 'queue_unsubscribe',
      sponsorId: "macrosoft"
    };
    socket.send(queueUnsubscribe);
  };

  handleQueuePop = () => {
    console.log("queue pop")
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
      <div id="queue-text">
        <div id="queue-option">
          <button id="queue-button" onclick={this.handleQueuePop}>
            Next Hacker
          </button>
        </div>
        <div id="queue-option">
          {hackers}
        </div>
      </div>
    );
  };

  createQueueModal = () => {
    this.subscribe();

    if (this.currentQueue === null) return (
      <div id="queue">
        <div id="root">
          <div class="queue-header" id="queue-header">
            <h1>Sponsor</h1>
          </div>
          <div class="queue-list" id="queue-list">
          </div>
        </div>
        <div id="queue-clouds"></div>
      </div>
    )

    return (
      <div id="queue">
        <div id="root">
          <div class="queue-header" id="queue-header">
            <h1>Sponsor</h1>
          </div>
          <div class="queue-list" id="queue-list">
            {this.createQueueContent()}
          </div>
        </div>
        <div id="queue-clouds"></div>
      </div>
    );
  };

  onClose = () => {
    this.unsubscribe();
  };

}

const queueSponsorInstance = new QueueSponsor();
export default queueSponsorInstance;
