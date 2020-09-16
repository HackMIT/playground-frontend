import socket from '../socket';

import '../../styles/nonprofit.scss';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class QueueForm {
  createQueueModal = () => {
    return (
      <div id="queue-form">
        <div id="queue-form-content">
          <p>What topics are you interested in?</p>

        </div>
      </div>
    )
  }
}

const formInstance = new QueueForm();
export default formInstance