import socket from '../socket';

import '../../styles/sponsorPanel.scss';
import characterManager from '../managers/character';
import notificationsManager from '../managers/notifications';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class SponsorPanel {
  constructor() {
    this.queue = [];
    this.sponsorId = '';
    this.sponsor = { queueOpen: false, challenges: "", url: "", description: "" }
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
        if (!this.isOpen) {
          const audio = new Audio('/audio/notification.mp3');
          audio.play();
          notificationsManager.displayMessage("Someone joined the queue", 7000);
        }
        break;
      case 'sponsor':
        this.sponsor = msg.sponsor;
        document.getElementById('sponsor-description-field').value =
          msg.sponsor.description;
        document.getElementById('sponsor-url-field').value = msg.sponsor.url || '';
        document.getElementById('sponsor-challenges-field').value = msg.sponsor.challenges;
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

    this.isOpen = true;
  };

  unsubscribe = () => {
    // socket.send({
    //   type: 'queue_unsubscribe',
    //   sponsorId: this.sponsorId,
    // });
    this.isOpen = false;
  };

  chat = (subscriberId) => {
    let zoomLink = document.getElementById('sponsor-zoom-link').value;

    if (zoomLink && !zoomLink.startsWith('http')) {
      zoomLink = `https://${zoomLink}`;
    }

    socket.send({
      type: 'queue_remove',
      characterId: subscriberId,
      sponsorId: this.sponsorId,
      zoom: zoomLink,
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
        <div id="sponsor-zoom">
          <p>Zoom Link: This is the link that hackers will receive when you accept them off of the queue.</p>
          <div id="sponsor-zoom-input">
            <input defaultValue={characterManager.character.zoom || ''} id="sponsor-zoom-link" />
            <button onclick={() => {
              socket.send({
                type: 'settings',
                zoom: document.getElementById('sponsor-zoom-link').value,
                settings: { twitterHandle: '' },
              })
            }}>Update</button>
          </div>
        </div>
        <div id="sponsor-toggle-container">
          <p>Queue Toggle: This turns the queue on and off for your entire company. Make sure to check with your other reps first before turning the queue off!</p>
          <div id="sponsor-queue-toggle">
            <button id={this.sponsor.queueOpen ? "sponsor-queue-off" : "sponsor-queue-on"} onclick={() => {
              socket.send({
                type: 'update_sponsor',
                setQueueOpen: true,
                queueOpen: !this.sponsor.queueOpen,
              })
            }} >{this.sponsor.queueOpen ? "Close the queue" : "Open the queue"}</button>
          </div>
        </div>
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
                let url = document.getElementById('sponsor-url-field').value;

                if (!url.startsWith('http')) {
                  url = `https://${url}`;
                }

                socket.send({
                  type: 'update_sponsor',
                  description: document.getElementById(
                    'sponsor-description-field'
                  ).value,
                  challenges: document.getElementById(
                    'sponsor-challenges-field'
                  ).value,
                  url,
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
