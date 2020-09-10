import '../../styles/message.scss';

import socket from '../socket';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class NotificationsPane {
  start = () => {
    socket.subscribe('notification', this.handleSocketMessage);
  };

  handleSocketMessage = (msg) => {
    if (msg.type !== 'notification') {
      return;
    }

    if (this.hideTimer !== undefined) {
      clearInterval(this.hideTimer);
    }

    document.getElementById('notifications-pane').classList.remove('hidden');
    document.getElementById('notification-text').innerText = msg.data.text;

    this.hideTimer = setTimeout(() => {
      document.getElementById('notifications-pane').classList.add('hidden');
    }, 7000);
  };
}

const notificationsPaneInstance = new NotificationsPane();
export default notificationsPaneInstance;
