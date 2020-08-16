class Socket {
  constructor() {
    this.conn = null;
    this.subscribers = new Map();
  }

  send(data) {
    this.conn.send(data);
  }

  start() {
    this.conn = new WebSocket('ws://localhost:8080/ws');
    this.conn.onopen = this.onopen;
    this.conn.onclose = this.onclose;
    this.conn.onmessage = (e) => {
      const messages = e.data.split('\n');

      messages.forEach((msg) => {
        const data = JSON.parse(msg);

        this.subscribers.forEach((handler, channels) => {
          if (channels.includes(data.type) || channels[0] === '*') {
            handler(data);
          }
        });
      });
    };
  }

  subscribe = (inputChannels, handler) => {
    const channels =
      typeof inputChannels === 'string' ? [inputChannels] : inputChannels;

    channels.forEach((element) => {
      this.subscribers.set(element, handler);
    });
  };
}

const socketInstance = new Socket();
export default socketInstance;
