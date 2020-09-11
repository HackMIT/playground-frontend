import '../../styles/message.scss';

import notificationsManager from './notifications';
import socket from '../socket';

class QueueManager {
  start = () => {
    socket.subscribe('queue_update_hacker', this.handleSocketMessage);
  };

  join = (sponsorId) => {
    if (this.queueSponsor !== undefined) {
      notificationsManager.displayMessage(
        `You are currently at position ${this.queuePosition} in the queue for ${this.queueSponsor}. You can leave this room, but keep the tab open: we'll let you know once it's your turn.`
      );

      return;
    }

    socket.send({
      type: 'queue_join',
      sponsorId,
    });
  };

  handleSocketMessage = (msg) => {
    let duration = 7000;
    let text;

    switch (msg.type) {
      case 'queue_update_hacker':
        if (this.queueSponsor === undefined) {
          // Show full message the first time they join the queue
          text = `You are currently at position ${msg.position} in the queue for ${msg.sponsorId}. You can leave this room, but keep the tab open: we'll let you know once it's your turn.`;
        } else if (msg.position === 0) {
          // Special message once you're off the queue
          text = `It's your turn to talk to ${this.queueSponsor}! Chat with them now at ${msg.url}`;
          duration = 30000;
        } else if (this.queuePosition !== msg.position) {
          // Show shortened message for small updates
          text = `You are currently at position ${msg.position} in the queue for ${msg.sponsorId}.`;
        } else {
          // Only display a notification if something changed
          return;
        }

        this.queueSponsor = msg.sponsorId;
        this.queuePosition = msg.position;

        break;
      case 'queue_update_sponsor':
        this.queueSponsor = msg.sponsorId;
        this.queueSubscribers = msg.subscribers;
        break;
      default:
        return;
    }

    notificationsManager.displayMessage(text, duration);
  };
}

const queueInstance = new QueueManager();
export default queueInstance;
