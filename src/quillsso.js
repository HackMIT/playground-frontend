import constants from './constants';

const param = '/login?token=';
const tokenURL = constants.baseURL + param;

const token = window.location.href.slice(tokenURL.length);
window.location.href = `${constants.baseURL}#${token}`;
