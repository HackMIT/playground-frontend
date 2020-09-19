import swal from 'sweetalert';

import './styles/attendance.scss';
import constants from './constants';
import socket from './js/socket';

socket.start();
socket.subscribe('join', (msg) => {
  document.getElementById(
    'confirm-message'
  ).innerHTML = `Please confirm your attendance for the <strong>${msg.event} Workshop</strong>`;
});

const param = '/attendance?id=';
const idURL = constants.baseURL + param;
const eventID = window.location.href.slice(idURL.length);

function handleSocketOpen() {
  const joinPacket = {
    type: 'join',
    event: eventID,
  };

  if (localStorage.getItem('token') !== null) {
    joinPacket.token = localStorage.getItem('token');
  } else {
    swal({
      title: 'Oops!',
      text: 'Please log in before confirming workshop attendance.',
      icon: 'error',
      button: 'Log in',
    }).then(() => {
      window.location.href = `${constants.baseURL}#/login`;
    });
    return;
  }

  // Connected to remote
  console.log('hello');
  socket.send(joinPacket);
}

function handleConfirm() {
  socket.send({
    type: 'event',
    id: eventID,
  });
  swal({
    title: 'Confirmed!',
    text: 'We hope you enjoyed the workshop :)',
    icon: 'success',
    button: 'Return to Playground',
  }).then(() => {
    window.location.href = `${constants.baseURL}`;
  });
}

socket.onload = handleSocketOpen;
document.getElementById('submit').onclick = handleConfirm;
