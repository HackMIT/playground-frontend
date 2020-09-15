import './styles/feedback.scss';
import './images/settingsicon.svg';
import './images/box.svg';
import './images/settingsclouds.svg';
import characterManager from './js/managers/character';


// eslint-disable-next-line
import createElement from './utils/jsxHelper';

class Feedback {
  goLink = () => {
    localStorage.setItem('token', null);
    console.log(characterManager.character.role)
    if (characterManager.character.role === 4){
      window.open("https://go.hackmit.org/hacker-feedback", '_blank');
    }
    else if (characterManager.character.role === 2) {
      window.open("https://go.hackmit.org/sponsor-feedback", '_blank');
    }
    else if (characterManager.character.role === 3) {
      window.open("https://go.hackmit.org/volunteer-feedback", '_blank');
    }
    else{ //for any other cases
      window.open("https://go.hackmit.org/hacker-feedback", '_blank');
    }
  };

  createFeedbackModal = () => {
    return (
      <div id="feedback">
        <div id="inner"> {/*Eva's border code*/} </div>
        <div id="root">
          <div id="feedback-logo">
        </div>
          <div class="feedback-header" id="feedback-header">
            <h1>How was your HackMIT experience?</h1>
          </div>
          {/* TODO: CHANGE FEEDBACK FORM LINK BASED ON WHETHER USER IS A SPONSOR OR A HACKER */}
          <div id = "feedback-flexcenter">
            <button id="feedback-logout" onclick={this.goLink}>
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
