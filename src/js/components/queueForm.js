import queueManager from '../managers/queue';

import '../../styles/queueForm.scss';
// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class QueueForm {
  createQueueModal = (sponsor) => {
    const queueTopics = [
      {
        id: 'companyTech',
        title: 'Company Technology',
      },
      {
        id: 'workshopQuestions',
        title: 'Workshop Questions',
      },
      {
        id: 'recruiting',
        title: 'Recruiting',
      },
      {
        id: 'companyInfo',
        title: 'Company Information',
      },
      {
        id: 'other',
        title: 'Other',
      },
    ].map((topic) => {
      return (
        <div className="checkbox-container">
          <input type="checkbox" name="queue-topics" value={topic.id} />
          <label for={topic.id}>{topic.title}</label>
        </div>
      );
    });

    return (
      <div id="queue-form">
        <div id="queue-form-content">
          <h1>Chat</h1>
          <div className="field checkbox-field">
            <p>Which topics are you interested in?</p>
            {queueTopics}
          </div>
          <button onclick={() => this.handleSubmitButton(sponsor)}>
            Submit
          </button>
        </div>
      </div>
    );
  };

  handleSubmitButton = (sponsor) => {
    const interests = Array.from(
      document.querySelectorAll('input[name="queue-topics"]:checked')
    ).map((elem) => elem.value);
    queueManager.join(sponsor, interests);

    document.getElementById('modal-background').remove();
  };
}

const formInstance = new QueueForm();
export default formInstance;
