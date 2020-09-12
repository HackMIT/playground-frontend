import coffeeIcon from '../../images/Coffee_Icon.svg';
import leaveQueueIcon from '../../images/icons/leave-queue.svg';
import '../../styles/message.scss';

import characterManager from './character';
import notificationsManager from './notifications';
import socket from '../socket';

class QueueManager {
  start = () => {
    socket.subscribe(['init', 'queue_update_hacker'], this.handleSocketMessage);
  };

  reset = (sponsor) => {
    document.getElementById('queue-button-icon').src = coffeeIcon;
    document.getElementById(
      'queue-button-text'
    ).innerText = `Talk to ${sponsor.name}`;

    this.sponsor = undefined;
    this.position = undefined;
  };

  join = (sponsor) => {
    if (this.sponsor !== undefined) {
      socket.send({
        type: 'queue_remove',
        characterId: characterManager.character.id,
        sponsorId: sponsor.id,
      });

      this.reset(sponsor);

      return;
    }

    this.sponsor = sponsor;

    socket.send({
      type: 'queue_join',
      sponsorId: sponsor.id,
    });
  };

  handleSocketMessage = (msg) => {
    let duration = 7000;
    let text;

    switch (msg.type) {
      case 'init':
        if (msg.room.sponsorId.length === 0) {
          return;
        }

        if (msg.room.sponsorId === msg.character.queueId) {
          this.sponsor = msg.room.sponsor;
          this.position = 999;

          document.getElementById('queue-button-icon').src = leaveQueueIcon;
          document.getElementById(
            'queue-button-text'
          ).innerText = `Leave Queue`;
        }

        return;
      case 'queue_update_hacker':
        if (msg.position === 0) {
          // Special message once you're off the queue
          text = `It's your turn to talk to ${this.sponsor.name}! Chat with them now at ${msg.url}`;
          duration = 30000;
          const audio = new Audio('/audio/notification.mp3');
          console.log('audio')
          console.log(audio);
          audio.play();
          this.reset(this.sponsor);
        } else if (this.sponsor === undefined) {
          // Show full message the first time they join the queue
          text = `You are currently at position ${msg.position} in the queue for ${this.sponsor.name}. You can leave this room, but keep the tab open: we'll let you know once it's your turn.`;
        } else if (this.position !== msg.position) {
          // Show shortened message for small updates
          text = `You are currently at position ${msg.position} in the queue for ${this.sponsor.name}.`;
        } else {
          // Only display a notification if something changed
          return;
        }

        this.position = msg.position;

        document.getElementById('queue-button-icon').src = leaveQueueIcon;
        document.getElementById('queue-button-text').innerText = `Leave Queue`;

        break;
      default:
        return;
    }

    notificationsManager.displayMessage(text, duration);
  };
}

const queueInstance = new QueueManager();
export default queueInstance;
