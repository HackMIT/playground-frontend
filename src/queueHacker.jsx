import socket from './js/socket';

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

  handleQueuePush = () => {
    console.log("queue push")
    const queuePush = {
      type: 'queue_push',
      sponsorId: "macrosoft"
    };
    socket.send(queuePush);
  };

  handleQueueRemove = () => {
    console.log("queue remove")
    const queueRemove = {
      type: 'queue_remove',
      sponsorId: "macrosoft"
    };
    socket.send(queueRemove);
  };

  createQueueContent = () => {
    const position = this.currentQueue.indexOf(12345)

    if (position === -1) {
      return (
        <div id="queue-text">
          <div id="queue-option">
            <button id="queue-button" onclick={this.handleQueuePush}>
              Join Queue
            </button>
          </div>
          <div id="queue-option">
            Length of hacker queue is currently {this.currentQueue.length}
          </div>
        </div>
      );
    }
    return (
      <div id="queue-text">
        <div id="queue-option">
          <button id="queue-button" onclick={this.handleQueueRemove}>
            Leave Queue
            </button>
        </div>
        <div id="queue-option">
          You are at position {position} of the hacker queue
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

const queueHackerInstance = new QueueHacker();
export default queueHackerInstance;
