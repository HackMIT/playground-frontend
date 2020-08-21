import './styles/attendance.scss';
import swal from 'sweetalert';
import socket from './js/socket';

socket.start();
socket.subscribe('join', (msg) => {
  console.log(msg);
  document.getElementById(
    'confirm-message'
  ).innerHTML = `Please confirm your attendance for the <strong>${msg.event} Workshop</strong>`;
})

const baseURL = 'http://localhost:3000';
const param = '/attendance?id=';
const idURL = baseURL + param;
const eventID = window.location.href.slice(idURL.length);

function handleSocketOpen() {
  const joinPacket = {
    type: 'join',
    event: eventID
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
      window.location.href = `${baseURL}#/login`;
    });
    return;
  }

  // Connected to remote
  socket.send(joinPacket);
}

function handleConfirm() {
  const token = localStorage.getItem('token');
  socket.send({
    type: 'event',
    name: eventID,
    user: token,
  });
  swal({
    title: 'Confirmed!',
    text: 'We hope you enjoyed the workshop :)',
    icon: 'success',
    button: 'Return to Playground',
  }).then(() => {
    window.location.href = `${baseURL}`;
  });
}

window.onload = handleSocketOpen;
document.getElementById('submit').onclick = handleConfirm;
