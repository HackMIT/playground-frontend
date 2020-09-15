import socket from '../socket';

import '../../styles/projectForm.scss';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class SponsorPanel {
  createFormModal = () => {
    const isFriday = new Date().getTime() < 1600498800000;

    const trackElems = [
      {
        id: 'communication',
        title: 'Communication & Connectivity',
      },
      {
        id: 'education',
        title: 'Education',
      },
      {
        id: 'health',
        title: 'Health',
      },
      {
        id: 'urban',
        title: 'Urban Innovation',
      },
    ].map((track) => {
      return (
        <div className="checkbox-container">
          <input type="radio" name="track" value={track.id} />
          <label for={track.id}>{track.title}</label>
        </div>
      );
    });

    const challengeElems = [
      {
        id: 'arrowstreet',
        title: '(Arrowstreet) Best Panel Data Visualization',
      },
      {
        id: 'cmt',
        title: '(CMT) Detecting Crashes in Smartphone Data',
      },
      {
        id: 'drw',
        title: '(DRW) Best Data Visualization Hack',
      },
      {
        id: 'facebook',
        title: '(Facebook) Best Hack for Building Community',
      },
      {
        id: 'goldman',
        title: '(Goldman Sachs) Best Use of Marquee API by Goldman Sachs',
      },
      {
        id: 'ibm',
        title:
          '(IBM) Best solution addressing the community response to COVID-19',
      },
    ].map((challenge) => {
      return (
        <div className="checkbox-container">
          <input type="checkbox" name="challenges" value={challenge.id} />
          <label for={challenge.id}>{challenge.title}</label>
        </div>
      );
    });

    return (
      <div id="project-form">
        <h1>{isFriday ? 'Fun Friday Form' : 'Spicy Saturday Survey'}</h1>
        <div className="field">
          <p>
            Enter a comma-separated list of the email addresses of your
            teammates. Make sure to use the same email addresses they signed up
            for HackMIT with. Only one person on your team needs to fill out
            this form.
          </p>
          <input type="text" id="teammates" />
        </div>
        <div className="field">
          <p>What's your project's name?</p>
          <input type="text" id="name" />
        </div>
        <div className="field">
          <p>
            Write a 1-2 sentence &ldquo;elevator pitch&rdquo; explaining your
            idea.
          </p>
          <input type="text" id="pitch" />
        </div>
        {isFriday ? (
          <div className="field">
            <p>
              If you&rsquo;ll be participating in peer expo (happening in the
              hacker arena at 6pm EDT!), enter a Zoom link that other
              participants can use to meet you.
            </p>
            <input type="text" id="zoom" />
          </div>
        ) : null}
        <div className="field checkbox-field">
          <p>Which track are you planning to submit to?</p>
          {trackElems}
        </div>
        <div className="field checkbox-field">
          <p>Which challenges are you planning to submit to?</p>
          {challengeElems}
        </div>
        <button onclick={() => this.handleSubmitButton()}>Submit</button>
      </div>
    );
  };

  handleSubmitButton = () => {
    const packet = {
      name: document.getElementById('name').value,
      pitch: document.getElementById('pitch').value,
      teammates: document
        .getElementById('teammates')
        .value.split(',')
        .map((x) => x.trim()),
      type: 'project_form',
      zoom: document.getElementById('zoom').value,
    };

    const selectedTrackElem = document.querySelector(
      'input[name="track"]:checked'
    );

    if (selectedTrackElem) {
      packet.track = selectedTrackElem.value;
    }

    const selectedChallengeElems = document.querySelectorAll(
      'input[name="challenges"]:checked'
    );

    if (selectedChallengeElems) {
      packet.challenges = Array.from(selectedChallengeElems).map(
        (elem) => elem.value
      );
    }

    socket.send(packet);
  };
}

const sponsorPanelInstance = new SponsorPanel();
export default sponsorPanelInstance;