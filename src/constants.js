const config = {
  calendarURL: 'https://go.hackmit.org/gcal',
};

const dev = {
  baseURL: 'http://localhost:3000',
  websocketURL: 'wss://backend.play.hackmit.org/ws',
};

const prod = {
  baseURL: 'https://play.hackmit.org',
  websocketURL: 'wss://backend.play.hackmit.org/ws',
};

export default {
  ...config,
  ...(process.env.NODE_ENV === 'development' ? dev : prod),
};
