import './styles/feedback.scss';
import './images/settingsicon.svg';
import './images/box.svg';
import './images/settingsclouds.svg';

// eslint-disable-next-line
import createElement from './utils/jsxHelper';

class Feedback {
  createFeedbackModal = () => {
    return (
      <div id="feedback">
        <div id="root">
          <div class="feedback-header" id="feedback-header">
            <h1>How's Your HackMIT Experience?</h1>
          </div>
          {/* TODO: CHANGE FEEDBACK FORM LINK BASED ON WHETHER USER IS A SPONSOR OR A HACKER */}
          <div id="feedback-text">
            Give us some feedback
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeMGME3ZJi-qO0P4uXegbHZNd6VMfozrHoQSpXZrPjpaSDDjA/viewform"
              target="_blank"
            >
              here
            </a>
            .
          </div>
        </div>
        <div id="feedback-clouds"></div>
      </div>
    );
  };
}

const feedbackInstance = new Feedback();
export default feedbackInstance;
