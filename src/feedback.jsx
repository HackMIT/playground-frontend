import './styles/feedback.scss';
import './images/settingsicon.svg';
import './images/box.svg';
import './images/settingsclouds.svg';

// eslint-disable-next-line
import createElement from './utils/jsxHelper';

class Feedback {
  constructor() {
    this.musicMuted = false;
    this.soundMuted = false;
  }

  createFeedbackModal = () => {
    return (
      <div id="feedback">
        <div id="root">
          <div class="feedback-header" id="feedback-header">
            <h1>Feedback</h1>
          </div>
          <div id="feedback-text">
            Give us some feedback: <a href="https://youtu.be/Ms7dpaA5iyw" target="_blank">gO/fEeDBaCk</a>
          </div>
        </div>
        <div id="feedback-clouds"></div>
      </div>
    );
  };
}

const feedbackInstance = new Feedback();
export default feedbackInstance;
