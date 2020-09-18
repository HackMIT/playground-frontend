const config = {
  calendarURL: 'https://go.hackmit.org/gcal',
  dances: {
    backflip: 0,
    clap: 1,
    dab: 2,
    floss: 3,
    jumpingJacks: 4,
    shoot: 5,
    walk: 6,
    wave: 7,
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
