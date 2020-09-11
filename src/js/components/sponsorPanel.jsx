// import characterManager from './js/managers/character';
import socket from '../socket';

import '../../styles/sponsor_panel.scss';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class SponsorPanel {
  constructor() {
    this.queue = [];
    this.sponsorId = 'cmt'; // characterManager.getSponsorId();
    socket.subscribe('queue_update_sponsor', this.handleSocketMessage);
  }

  updateQueueContent = () => {
    const queueList = document.getElementById('queue');

    if (queueList !== null) {
      queueList.innerHTML = '';
      queueList.appendChild(this.createQueueContent());
    }
  };

  handleSocketMessage = (msg) => {
    switch (msg.type) {
      case 'queue_update_sponsor':
        this.queue = msg.subscribers;
        break;
      default:
        break;
    }

    this.updateQueueContent();
  };

  subscribe = () => {
    socket.send({
      type: 'queue_subscribe',
      sponsorId: this.sponsorId,
    });
  };

  unsubscribe = () => {
    socket.send({
      type: 'queue_unsubscribe',
      sponsorId: this.sponsorId,
    });
  };

  chat = (subscriberId) => {
    socket.send({
      type: 'queue_remove',
      characterId: subscriberId,
      sponsorId: this.sponsorId,
    });
  };

  createQueueContent = () => {
    const hackerElems = this.queue.map((subscriber) => {
      return (
        <div className="hacker">
          <p>
            {subscriber.name} &bull; {subscriber.school}, {subscriber.gradYear}
          </p>
          <p>
            Interested in <strong>recruiting</strong>, <strong>APIs</strong>
          </p>
          <button onclick={() => this.chat(subscriber.id)}>Chat</button>
        </div>
      );
    });

    return (
      <div>
        <h2>Hacker Queue</h2>
        <div>{hackerElems}</div>
      </div>
    );
  };

  createQueueModal = () => {
    return (
      <div id="sponsor-panel">
        <h1>Sponsor Panel</h1>
        <div id="table">
          <div id="options">
            <h2>Company Details</h2>
            <input type="text" placeholder="Description" />
          </div>
          <div className="spacer" />
          <div id="queue">{this.createQueueContent()}</div>
        </div>
      </div>
    );
  };

  onClose = this.unsubscribe;
}

const sponsorPanelInstance = new SponsorPanel();
export default sponsorPanelInstance;
