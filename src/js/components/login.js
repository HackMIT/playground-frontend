import socket from '../socket';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

const SPONSOR = 1;

const INITIAL_STATE = 0;
const GET_EMAIL = 1;
const CHECK_EMAIL = 2;
const CREATE_ACCOUNT = 3;

class LoginPanel {
  constructor() {
    this.state = INITIAL_STATE;

    socket.subscribe('init', this.handleInitPacket);
  }

  show = () => {
    document.getElementById('login-panel').style.display = 'block';
  };

  hide = () => {
    document.getElementById('login-panel').style.display = 'none';
  };

  update = () => {
    document.getElementById('login-panel').innerHTML = '';
    document.getElementById('login-panel').appendChild(this.contents());
  };

  contents = () => {
    switch (this.state) {
      case INITIAL_STATE:
        return (
          <div>
            <h1>Log into Playground</h1>
            <a
              className="green"
              href="https://my.hackmit.org/login?sso=http://localhost:3000/login"
            >
              Hacker Login
            </a>
            <button
              className="blue"
              onclick={() => this.handleEmailLogin(SPONSOR)}
            >
              Sponsor Login
            </button>
            <button
              className="red"
              onclick={() => {
                // TODO: Replace with handleEmailLogin(ORGANIZER)
                socket.send({
                  type: 'join',
                  name: prompt("What's your name?"),
                });
              }}
            >
              Organizer Login
            </button>
          </div>
        );
      case GET_EMAIL:
        return (
          <div>
            <h1>Enter your email</h1>
            <input id="email-field" type="text" placeholder="your@email.com" />
            <div className="buttons-container">
              <button
                className="red"
                onclick={() => {
                  this.state = INITIAL_STATE;
                  this.update();
                }}
              >
                Back
              </button>
              <button
                className="green"
                onclick={() => {
                  this.email = document.getElementById('email-field').value;
                  this.state = CHECK_EMAIL;
                  this.update();

                  socket.send({
                    type: 'email_code',
                    email: this.email,
                  });
                }}
              >
                Submit
              </button>
            </div>
          </div>
        );
      case CHECK_EMAIL:
        return (
          <div>
            <h1>Enter your code</h1>
            <p>
              If your email address is associated with a valid Hack Penguin
              account, we just sent you an email with a verification code. Enter
              it here to log in!
            </p>
            <input id="code-field" type="text" placeholder="123456" />
            <div className="buttons-container">
              <button
                className="red"
                onclick={() => {
                  this.state = GET_EMAIL;
                  this.update();
                }}
              >
                Back
              </button>
              <button
                className="green"
                onclick={() => {
                  socket.send({
                    type: 'join',
                    email: this.email,
                    code: parseInt(
                      document.getElementById('code-field').value,
                      10
                    ),
                  });
                }}
              >
                Submit
              </button>
            </div>
          </div>
        );
      case CREATE_ACCOUNT:
        return (
          <div>
            <h1>Create account</h1>
            <div className="field">
              <p>Name</p>
              <input type="text" placeholder="Ben Bitdiddle" id="name-field" />
            </div>
            <h2>Notifications</h2>
            <p className="small">
              We recommend you enable all of these. We'll only alert you if it's
              very urgent, like when you have a scheduled chat with a sponsor,
              or if you need to present at our closing ceremony.
            </p>
            <div className="field checkbox">
              <input type="checkbox" checked disabled />
              <p>Emails to {this.email}</p>
            </div>
            <div className="field checkbox">
              <input type="checkbox" />
              <p>Slack alerts</p>
            </div>
            <div className="field checkbox">
              <input type="checkbox" id="phone-checkbox" />
              <div>
                <p>Text messages (US Only)</p>
                <input
                  type="text"
                  placeholder="(917) 555-1234"
                  id="phone-field"
                />
              </div>
            </div>
            <div className="field checkbox">
              <input type="checkbox" />
              <p>Browser notifications</p>
            </div>
            <p id="error-text">Please enter a valid phone number.</p>
            <button
              className="green"
              onclick={() => {
                const showError = (error) => {
                  document.getElementById('error-text').innerText = error;
                  document
                    .getElementById('error-text')
                    .classList.add('visible');
                };

                const data = {
                  type: 'register',
                };

                const nameField = document.getElementById('name-field');
                if (nameField.value.length > 0) {
                  data.name = nameField.value;
                } else {
                  showError('Please enter your name.');
                  return;
                }

                if (document.getElementById('phone-checkbox').checked) {
                  // Remove all non-numeric characters
                  let phoneNumber = document
                    .getElementById('phone-field')
                    .value.replace(/\D/g, '');

                  // If they inserted the 1 before their phone number, remove it
                  if (phoneNumber.length === 11 && phoneNumber[0] === '1') {
                    phoneNumber = phoneNumber.substring(1, phoneNumber.length);
                  }

                  if (phoneNumber.length === 10) {
                    data.phoneNumber = `+1${data.phoneNumber}`;
                  } else {
                    showError('Please enter a valid phone number.');
                    return;
                  }
                }

                socket.send(data);
              }}
            >
              Submit
            </button>
          </div>
        );
      default:
        return <div />;
    }
  };

  handleEmailLogin(role) {
    this.state = GET_EMAIL;
    this.role = role;
    this.update();
  }

  handleInitPacket = () => {
    this.state = CREATE_ACCOUNT;
    this.update();
  };
}

const friendsPaneInstance = new LoginPanel();
export default friendsPaneInstance;
