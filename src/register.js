import './styles/register.scss';

function toggleMode(userType) {
  if (userType === 'hacker') {
    document.getElementById('sponsor').style.display = 'none';
  } else {
    document.getElementById('hacker').style.display = 'none';
  }
}

const userType = 'hacker';
toggleMode(userType);

function enterPhone() {
  const checkBox = document.getElementById('SMS');

  // users can enter phone number
  if (checkBox.checked === true) {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'phoneNum';

    const div = document.createElement('div');
    div.id = 'phoneNumField';
    div.innerHTML = 'Enter your phone number (US) here: ';
    div.appendChild(input);
    div.style.display = 'block';
    div.style.paddingBottom = '10px';

    document.getElementById('coc-warning').prepend(div);
  } else {
    document.getElementById('phoneNumField').remove();
  }
}

/*
WARNING: in chrome, user must go to "chrome://flags" and disable 'Enable native notifications'
for this to work
*/

function setNotifications() {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    alert('This browser does not support desktop notification');
  } else if (Notification.permission === 'granted') {
    const notification = new Notification('Browser notifications enabled!');
    console.log('Browser notifications enabled!');
    console.log(notification);
  } else if (Notification.permission !== 'granted') {
    console.log('Browser notifications denied!');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        const notification = new Notification('Welcome to HackPenguin notifications!');
        console.log(notification);
      }
    });
  }
}

function redirect() {
  const email = document.getElementById('email');
  const text = document.getElementById('SMS');
  const browser = document.getElementById('browser');

  let textdata = [];
  if (text.checked === true) {
    textdata = [true, document.getElementById('phoneNum').value];
  }

  // check if browser notifications are supported
  setNotifications();

  localStorage.setItem('email', JSON.parse(email.checked));
  localStorage.setItem('phone', JSON.stringify(textdata));
  localStorage.setItem('browser', JSON.parse(browser.checked));

  document.getElementById('submit-button').onclick = function () {
    window.location.href = 'http://localhost:3000/character';
  };
}

function showSubmit() {
  const checkbox = document.getElementById('sign');

  if (checkbox.checked === true) {
    document.getElementById('submit').style.display = 'block';
    document.getElementById('submit').style.alignContent = 'center';
  } else {
    document.getElementById('submit').style.display = 'none';
  }
}

document.getElementById('SMS').addEventListener('click', enterPhone);
document.getElementById('submit').addEventListener('click', redirect);
document.getElementById('instructions').addEventListener('click', () => {
  const text = document.getElementById('text');
  console.log(text.style.maxHeight);
  if (text.style.maxHeight === '') {
    console.log('expanding');
    text.style.maxHeight = 'none';
  } else {
    console.log('contracting');
    text.style.maxHeight = '';
  }
});
document.getElementById('sign').addEventListener('click', showSubmit);
