import '../../styles/message.scss';

import socket from '../socket';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class NotificationsPane {
  start = () => {
    socket.subscribe('notification', this.handleSocketMessage);
  };

  displayMessage = (msg, duration = 7000) => {
    if (this.hideTimer !== undefined) {
      clearInterval(this.hideTimer);
    }

    document.getElementById('notifications-pane').classList.remove('hidden');
    document.getElementById('notification-text').innerText = msg;

    this.hideTimer = setTimeout(() => {
      document.getElementById('notifications-pane').classList.add('hidden');

      setTimeout(() => {
        // Hide text after the notification animates out
        document.getElementById('notification-text').innerText = '';
      }, 250);
    }, duration);
  };

  handleSocketMessage = (msg) => {
    if (msg.type !== 'notification') {
      return;
    }

    this.displayMessage(msg.data.text);
  };
}

const notificationsPaneInstance = new NotificationsPane();
export default notificationsPaneInstance;
