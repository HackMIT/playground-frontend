import socket from '../socket';

class StatusManager {
  constructor() {
    document.addEventListener('visibilitychange', () =>
      this.onVisibilityChange()
    );
  }

  onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      this.invisibilityTimer = setTimeout(() => {
        socket.send({
          type: 'status',
          active: false,
        });
      }, 600);
    } else {
      if (this.invisibilityTimer !== undefined) {
        clearInterval(this.invisibilityTimer);
      }

      socket.send({
        type: 'status',
        active: true,
      });
    }
  };
}

const manager = new StatusManager();
export default manager;
