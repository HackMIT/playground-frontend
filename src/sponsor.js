import './styles/index.scss';
import axios from 'axios';

const sponsorBaseURL = 'http://localhost:8080/sponsor/';
let id = '';

const signInForm = document.getElementById('sign-in-form');
function handleSignIn(event) {
  event.preventDefault();
  axios.get(sponsorBaseURL + document.getElementById('id').value).then((res) => {
    id = document.getElementById('id').value;
    document.getElementById('data-dump').innerHTML = res.data;
    document.getElementById('sponsor-name').innerHTML = `${res.data.Name} admin page`;
    document.getElementById('secret-id').innerHTML = `Secret id: ${res.data.Id}`;
    document.getElementById('room-color').innerHTML = `Room color: ${res.data.Color}`;
  });
}
signInForm.addEventListener('submit', handleSignIn);

const colorForm = document.getElementById('change-color');
function handleColorChange(event) {
  event.preventDefault();
  if (id !== '') {
    const color = document.getElementById('new-color').value;
    axios.put(sponsorBaseURL + id, {
      color,
    }).then(() => {
      document.getElementById('room-color').innerHTML = `Room color: ${color}`;
    });
  } else {
    alert('Sign in first');
  }
}
colorForm.addEventListener('submit', handleColorChange);
