const config = {
  calendarURL: 'https://go.hackmit.org/gcal',
  dances: {
    dab: 0,
    floss: 1,
    walk: 2,
    wave: 3,
  },
};

const dev = {
  baseURL: 'http://localhost:3000',
  websocketURL: 'ws://localhost:5000/ws',
};

const prod = {
  baseURL: 'https://play.hackmit.org',
  websocketURL: 'wss://backend.play.hackmit.org/ws',
};

export default {
  ...config,
  ...(process.env.NODE_ENV === 'development' ? dev : prod),
};
