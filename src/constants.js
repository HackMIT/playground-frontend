const dev = {
  ws_url: 'ws://localhost:5000/ws',
};

const prod = {
  ws_url: 'wss://backend.play.hackmit.org/ws',
};

const projectConfig = process.env.NODE_ENV === 'development' ? dev : prod;
export default projectConfig;
