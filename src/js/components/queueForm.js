import queueManager from '../managers/queue'

import '../../styles/queueForm.scss';
// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class QueueForm {
  createQueueModal = (sponsor) => {
    const queueTopics = [
      {
        id: 'company-tech',
        title: 'Company Technology',
      },
      {
        id: 'workshop-questions',
        title: 'Workshop Questions',
      },
      {
        id: 'recruiting',
        title: 'Recruiting',
      },
      {
        id: 'company-info',
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
          <button onclick={() => this.handleSubmitButton(sponsor)}>Submit</button>
        </div>
      </div>
    )
  }

  handleSubmitButton = (sponsor) => {
    document.getElementById('modal-background').remove();
    queueManager.join(sponsor);
  }
}

const formInstance = new QueueForm();
export default formInstance