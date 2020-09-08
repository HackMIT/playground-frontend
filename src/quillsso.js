const baseURL = 'http://localhost:3000';
const param = '/login?token=';
const tokenURL = baseURL + param;

const token = window.location.href.slice(tokenURL.length);
window.location.href = `${baseURL}#${token}`;
