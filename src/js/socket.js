import constants from '../constants';

class Socket {
  constructor() {
    this.conn = null;
    this.subscribers = new Map();
  }

  send(data) {
    this.conn.send(JSON.stringify(data));
  }

  start() {
    this.conn = new WebSocket(constants.ws_url);
    this.conn.onopen = this.onopen;
    this.conn.onclose = this.onclose;
    this.conn.onmessage = (e) => {
      const messages = e.data.split('\n');

      messages.forEach((msg) => {
        const data = JSON.parse(msg);

        this.subscribers.forEach((handlers, channel) => {
          if (channel === data.type || channel === '*') {
            handlers.forEach((handler) => {
              handler(data);
            });
          }
        });
      });
    };
  }

  subscribe = (inputChannels, handler) => {
    const channels =
      typeof inputChannels === 'string' ? [inputChannels] : inputChannels;

    channels.forEach((element) => {
      if (this.subscribers.has(element)) {
        this.subscribers.set(
          element,
          this.subscribers.get(element).concat(handler)
        );
      } else {
        this.subscribers.set(element, [handler]);
      }
    });
  };
}

const socketInstance = new Socket();
export default socketInstance;
