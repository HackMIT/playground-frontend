import swal from 'sweetalert';

import './styles/attendance.scss';
import constants from './constants';
import socket from './js/socket';

const eventID = window.location.href.split('=')[1];

function handleSocketOpen() {
  const joinPacket = {
    type: 'join',
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

socket.onopen = handleSocketOpen;

socket.subscribe(['*'], (msg) => {
  document.getElementById(
    'confirm-message'
  ).innerHTML = `Please confirm your attendance for the <strong>${msg.event} Workshop</strong>`;
});

socket.start();

document.getElementById('submit').onclick = handleConfirm;
