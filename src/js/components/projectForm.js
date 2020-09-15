import '../../styles/projectForm.scss';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class SponsorPanel {
  createFormModal = () => {
    return (
      <div id="project-form">
        <h1>
          {new Date().getTime() < 1600498800000
            ? 'Fun Friday Form'
            : 'Spicy Saturday Survey'}
        </h1>
        <div className="field">
          <p>
            Enter a comma-separated list of the email addresses of your
            teammates. Only one person on your team needs to fill out this form.
          </p>
          <input type="text" />
        </div>
        <div className="field">
          <p>What's your project's name?</p>
          <input type="text" />
        </div>
        <div className="field">
          <p>
            Write a 1-2 sentence &ldquo;elevator pitch&rdquo; explaining your
            idea.
          </p>
          <input type="text" />
        </div>
        <div className="field checkbox-field">
          <p>Which track are you planning to submit to?</p>
          <div className="checkbox-container">
            <input type="radio" name="track" value="communication" />
            <label for="communication">Communication &amp; Connectivity</label>
          </div>
          <div className="checkbox-container">
            <input type="radio" name="track" value="education" />
            <label for="education">Education</label>
          </div>
          <div className="checkbox-container">
            <input type="radio" name="track" value="health" />
            <label for="health">Health</label>
          </div>
          <div className="checkbox-container">
            <input type="radio" name="track" value="urban" />
            <label for="urban">Urban Innovation</label>
          </div>
        </div>
        <div className="field checkbox-field">
          <p>Which challenges are you planning to submit to?</p>
          <div className="checkbox-container">
            <input type="checkbox" name="challenges" value="drw" />
            <label for="drw">(DRW) Best Data Visualization Hack</label>
          </div>
        </div>
        <button onclick={() => {}}>Submit</button>
      </div>
    );
  };
}

const sponsorPanelInstance = new SponsorPanel();
export default sponsorPanelInstance;
