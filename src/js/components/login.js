import constants from '../../constants';
import socket from '../socket';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

const ORGANIZER = 1;
const SPONSOR = 2;
const MENTOR = 3;

const INITIAL_STATE = 0;
const GET_EMAIL = 1;
const CHECK_EMAIL = 2;
const CREATE_ACCOUNT = 3;
const CODE_OF_CONDUCT = 4;
const CHECK_GITHUB = 5;

class LoginPanel {
  constructor() {
    this.name = '';
    this.location = '';
    this.bio = '';
    this.nameFieldDisabled = false;
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
              className="green button"
              href={`https://my.hackmit.org/login?sso=${constants.baseURL}/login`}
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
              className="yellow"
              onclick={() => this.handleEmailLogin(MENTOR)}
            >
              Mentor Login
            </button>
            <button
              className="red"
              onclick={() => this.handleEmailLogin(ORGANIZER)}
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
                    role: this.role,
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
              <input
                type="text"
                placeholder="Ben Bitdiddle"
                id="name-field"
                defaultValue={this.name}
                disabled={this.nameFieldDisabled}
              />
            </div>
            <div className="field">
              <p>Location</p>
              <input
                type="text"
                placeholder="Cambridge, MA"
                id="location-field"
                maxLength="30"
              />
            </div>
            <div className="field">
              <p>Short bio (&#8804; 150 characters)</p>
              <textarea id="bio-field" maxLength="150" rows="4" />
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

                const nameField = document.getElementById('name-field');
                if (nameField.value.length > 0) {
                  this.name = nameField.value;
                } else {
                  showError('Please enter your name.');
                  return;
                }

                const locationField = document.getElementById('location-field');
                if (locationField.value.length <= 30) {
                  this.location = locationField.value;
                } else {
                  showError(
                    'Please shorten your location to 30 characters or fewer.'
                  );
                  return;
                }

                const bioField = document.getElementById('bio-field');
                if (bioField.value.length <= 150) {
                  this.bio = bioField.value;
                } else {
                  showError(
                    'Please shorten your bio to 150 characters or fewer.'
                  );
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
                    this.phoneNumber = `+1${phoneNumber}`;
                  } else {
                    showError('Please enter a valid phone number.');
                    return;
                  }
                }

                this.state = CODE_OF_CONDUCT;
                this.update();
              }}
            >
              Submit
            </button>
          </div>
        );
      case CODE_OF_CONDUCT:
        return (
          <div>
            <h1>Code of Conduct</h1>
            <p>
              Our team spent countless hours building the HackMIT Playground to
              create a unique and special event for you.{' '}
              <strong>
                All forms of abuse of our platform will not be tolerated.
              </strong>{' '}
              By checking the box below, you agree to follow our{' '}
              <a href="http://go.hackmit.org/code-of-conduct" target="_blank">
                code of conduct
              </a>{' '}
              throughout the weekend.
            </p>
            <div className="field checkbox centered extra-vspace">
              <input
                type="checkbox"
                onchange={(e) => {
                  document.getElementById('finish-button').disabled = !e.target
                    .checked;
                }}
              />
              <p>
                I have read and agree to follow the HackMIT{' '}
                <a href="http://go.hackmit.org/code-of-conduct" target="_blank">
                  code of conduct
                </a>
              </p>
            </div>
            <button
              id="finish-button"
              className="green"
              disabled
              onclick={() => {
                this.state = CHECK_GITHUB;
                this.update();
              }}
            >
              Continue
            </button>
          </div>
        );
      case CHECK_GITHUB:
        return (
          <div>
            <h1>Enjoy!</h1>
            <p>
              If you like what you see, please consider giving us a star on
              GitHub! Enjoy your weekend!
            </p>
            <button
              className="blue"
              onclick={() =>
                window.open('https://github.com/hackmit/playground', '_blank')
              }
            >
              Go to GitHub
            </button>
            <button
              id="finish-button"
              className="green"
              onclick={() => this.finish()}
            >
              Finish
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

  handleInitPacket = (data) => {
    if (
      data.character.name.length > 0 &&
      !data.character.name.startsWith('Player')
    ) {
      this.name = data.character.name;
      this.nameFieldDisabled = data.character.role === 4;

      this.email = data.character.email;
    }

    this.state = CREATE_ACCOUNT;
    this.update();
  };

  finish = () => {
    const data = {
      type: 'register',
    };

    if (this.name !== undefined) {
      data.name = this.name;
    }

    if (this.phoneNumber !== undefined) {
      data.phoneNumber = this.phoneNumber;
    }

    if (this.location !== undefined) {
      data.location = this.location;
    }

    if (this.bio !== undefined) {
      data.bio = this.bio;
    }

    socket.send(data);
  };
}

const friendsPaneInstance = new LoginPanel();
export default friendsPaneInstance;
