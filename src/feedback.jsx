import './styles/feedback.scss';
import './images/settingsicon.svg';
import './images/box.svg';
import './images/settingsclouds.svg';
import characterManager from './js/managers/character';

// eslint-disable-next-line
import createElement from './utils/jsxHelper';

class Feedback {
  openFeedback = () => {
    switch (characterManager.character.role) {
      case 2:
        window.open('https://go.hackmit.org/sponsor-feedback', '_blank');
        break;
      case 3:
        window.open('https://go.hackmit.org/volunteer-feedback', '_blank');
        break;
      default:
        window.open('https://go.hackmit.org/hacker-feedback', '_blank');
        break;
    }
  };

  createFeedbackModal = () => {
    return (
      <div id="feedback">
        <div id="inner" />
        <div id="root">
          <div id="feedback-logo"></div>
          <div class="feedback-header" id="feedback-header">
            <h1>How was your HackMIT experience?</h1>
          </div>
          <div id="feedback-flexcenter">
            <button id="feedback-logout" onclick={() => this.openFeedback()}>
              GIVE FEEDBACK
            </button>
          </div>
        </div>
        <div id="feedback-clouds"></div>
      </div>
    );
  };
}

const feedbackInstance = new Feedback();
export default feedbackInstance;
