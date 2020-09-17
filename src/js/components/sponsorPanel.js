import socket from '../socket';

import '../../styles/sponsorPanel.scss';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class SponsorPanel {
  constructor() {
    this.queue = [];
    this.sponsorId = '';

    socket.subscribe(
      ['queue_update_sponsor', 'sponsor'],
      this.handleSocketMessage
    );
  }

  updateQueueContent = () => {
    const queueList = document.getElementById('queue');

    if (queueList !== null) {
      queueList.innerHTML = '';
      queueList.appendChild(this.createQueueContent());
    }
  };

  handleSocketMessage = (msg) => {
    switch (msg.type) {
      case 'queue_update_sponsor':
        this.queue = msg.subscribers;
        break;
      case 'sponsor':
        document.getElementById('sponsor-description-field').value =
          msg.sponsor.description;
        document.getElementById('sponsor-url-field').value = msg.sponsor.url;
        break;
      default:
        break;
    }

    this.updateQueueContent();
  };

  subscribe = (sponsorId) => {
    this.sponsorId = sponsorId;

    socket.send({
      type: 'get_sponsor',
      id: this.sponsorId,
    });

    socket.send({
      type: 'queue_subscribe',
      sponsorId: this.sponsorId,
    });
  };

  unsubscribe = () => {
    socket.send({
      type: 'queue_unsubscribe',
      sponsorId: this.sponsorId,
    });
  };

  chat = (subscriberId) => {
    socket.send({
      type: 'queue_remove',
      characterId: subscriberId,
      sponsorId: this.sponsorId,
    });
  };

  createQueueContent = () => {
    const queueTopics = {
      companyTech: 'Company Technology',
      workshopQuestions: 'Workshop Questions',
      recruiting: 'Recruiting',
      companyInfo: 'Company Information',
      other: 'Other',
    };

    const hackerElems = this.queue.map((subscriber) => {
      console.log(subscriber);
      return (
        <div className="hacker">
          <p>
            {subscriber.name} &bull; {subscriber.school}, {subscriber.gradYear}
          </p>
          <p>
            Interested in{' '}
            {subscriber.interests
              .split(',')
              .map((x) => queueTopics[x])
              .join(', ')}
          </p>
          <button onclick={() => this.chat(subscriber.id)}>Chat</button>
        </div>
      );
    });

    return (
      <div>
        <h2>Hacker Queue</h2>
        <div>{hackerElems}</div>
      </div>
    );
  };

  createQueueModal = () => {
    return (
      <div id="sponsor-panel">
        <h1>Sponsor Panel</h1>
        <div id="table">
          <div id="options">
            <h2>Company Details</h2>
            <div className="field">
              <p>
                Description: A brief description of your company, to be
                displayed on the right side of the screen when hackers enter
                your room. Make sure to include the times your queue will be
                open.
              </p>
              <textarea
                id="sponsor-description-field"
                placeholder="Company A is working hard to bring financial literacy to those who need it most. Talk to us to learn more about our challenges and recruiting opportunities! Our queue will be open all of Friday night and 9am-1pm EDT on Saturday."
                rows="6"
              />
            </div>
            <div className="field">
              <p>
                Challenges: A description of the challenge(s) you're offering
                this weekend, including any relevant details, criteria, and
                prizes.
              </p>
              <textarea
                id="sponsor-challenges-field"
                placeholder="We're looking for the best hacks that teach financial literacy!&#10;&#10;Prize: $100 Amazon gift card for each team member"
                rows="6"
              />
            </div>
            <div className="field">
              <p>
                URL: The URL hackers will be redirected to when clicking on the
                "Visit Website" button. Feel free to use this to share
                recruitment opportunities.
              </p>
              <input
                id="sponsor-url-field"
                type="text"
                placeholder="https://company.com/jobs"
              />
            </div>
            <button
              id="sponsor-panel-submit"
              onclick={() => {
                socket.send({
                  type: 'update_sponsor',
                  description: document.getElementById(
                    'sponsor-description-field'
                  ).value,
                  challenges: document.getElementById(
                    'sponsor-challenges-field'
                  ).value,
                  url: document.getElementById('sponsor-url-field').value,
                });
                document
                  .getElementById('sponsor-panel-submit')
                  .insertAdjacentHTML(
                    'beforeBegin',
                    '<p id="challenge-submitted">Submitted!</p>'
                  );
              }}
            >
              Submit
            </button>
          </div>
          <div className="spacer" />
          <div id="queue">{this.createQueueContent()}</div>
        </div>
      </div>
    );
  };

  onClose = this.unsubscribe;
}

const sponsorPanelInstance = new SponsorPanel();
export default sponsorPanelInstance;
