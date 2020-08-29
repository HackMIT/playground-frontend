const dev = {
  ws_url: 'ws://localhost:5000/ws',
  quill_redirect_url: 'http://localhost:3000',
};

const prod = {
  ws_url: 'wss://backend.play.hackmit.org/ws',
  quill_redirect_url: 'https://play.hackmit.org',
};

const projectConfig = process.env.NODE_ENV === 'development' ? dev : prod;
export default projectConfig;
