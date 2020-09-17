import validator from 'email-validator';

import socket from '../socket';
import createModal from '../../modal';

import '../../styles/projectForm.scss';

import notificationsManager from '../managers/notifications'
// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class SponsorPanel {
  createProjectModal = (project) => {
    const challenges = project.challenges.split(',')
      .map((x) => x.trim());
    const team = project.emails.split(',')
      .map((x) => x.trim());
    return (
      <div id="project-summary">
        <h3>Project Name:{" "}</h3> {project.name}
        <h3>Team Emails: </h3>{team.join(", ")}
        <h3>Pitch: </h3>{project.pitch}
        <h3>Track: </h3>{project.track}
        {project.zoom ? <div><h3>Expo zoom link: </h3> {project.zoom}</div> : <div></div>}
        <h3>Challenges: </h3>
        {challenges.map(challenge => {
          switch (challenge) {
            case 'arrowstreet':
              return <p>(Arrowstreet) Best Panel Data Visualization</p>
            case 'cmt':
              return <p>(CMT) Detecting Crashes in Smartphone Data</p>
            case 'drw':
              return <p>(DRW) Best Data Visualization Hack</p>
            case 'facebook':
              return <p>(Facebook) Best Hack for Building Community</p>
            case 'goldman':
              return <p>(Goldman Sachs) Best Use of Marquee API by Goldman Sachs</p>
            case 'ibm':
              return <p>(IBM) Best solution addressing the community response to COVID-19</p>
            default:
              return <p>No challenges selected</p>
          }
        })}
        <button
          id="project-form-resubmit"
          onclick={() => this.handleResubmitButton()}
        >
          Edit/Resubmit
        </button>
      </div>
    )
  }

  handleResubmitButton = () => {
    document.getElementById('modal-background').remove();
    createModal(this.createFormModal());
  }

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
            {isFriday ? <p>
              If you&rsquo;ll be participating in peer expo (happening in the
              hacker arena at 6pm EDT!), enter a Zoom link that other
              participants can use to meet you.
            </p> : <div></div>}
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
        <div id="form-errors"></div>
        <button
          id="project-form-submit"
          onclick={() => this.handleSubmitButton()}
        >
          Submit
        </button>
      </div>
    );
  };

  handleSubmitButton = () => {
    document.getElementById('form-errors').innerHTML = '';
    let submit = true;
    const selectedTrackElem = document.querySelector(
      'input[name="track"]:checked'
    );

    const selectedChallengeElems = document.querySelectorAll(
      'input[name="challenges"]:checked'
    );

    let teamList = document
      .getElementById('teammates')
      .value.split(',')
      .map((x) => x.trim());

    if (teamList.length === 1 && teamList[0].length === 0) {
      teamList = [];
    }

    if (teamList.length > 3) {
      document
        .getElementById('form-errors')
        .insertAdjacentHTML(
          'beforeend',
          '<p>Cannot have more than four people on a team!</p>'
        );
      submit = false;
    }

    if (teamList.length > 0 && teamList[0] !== '') {
      teamList.forEach((email) => {
        if (!validator.validate(email)) {
          document
            .getElementById('form-errors')
            .insertAdjacentHTML(
              'beforeend',
              `<p>${email} is not a valid email!</p>`
            );
          submit = false;
        }
      });
    }

    if (document.getElementById('name').value === '') {
      document
        .getElementById('form-errors')
        .insertAdjacentHTML('beforeend', `<p>Enter a project name!</p>`);
      submit = false;
    }

    if (document.getElementById('pitch').value === '') {
      document
        .getElementById('form-errors')
        .insertAdjacentHTML('beforeend', `<p>Enter a project description!</p>`);
      submit = false;
    }

    if (!selectedTrackElem) {
      document
        .getElementById('form-errors')
        .insertAdjacentHTML(
          'beforeend',
          '<p>Please select a track to submit to.</p>'
        );
      submit = false;
    }

    const packet = {
      name: document.getElementById('name').value,
      pitch: document.getElementById('pitch').value,
      teammates: teamList,
      type: 'project_form',
      zoom: document.getElementById('zoom').value,
    };

    if (selectedTrackElem) {
      packet.track = selectedTrackElem.value;
    }

    if (selectedChallengeElems) {
      packet.challenges = Array.from(selectedChallengeElems).map(
        (elem) => elem.value
      );
    }
    if (submit) {
      socket.send(packet);
      notificationsManager.displayMessage("You successfully submitted your project form!")
      document.getElementById('modal-background').remove();
    }
  };
}

const sponsorPanelInstance = new SponsorPanel();
export default sponsorPanelInstance;
