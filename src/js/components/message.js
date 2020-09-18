import '../../styles/message.scss';

import socket from '../socket';

import closeIcon from '../../images/icons/close-white.svg';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class MessagePane {
  constructor() {
    this.messages = [];
    this.hidden = true;
    socket.subscribe(['message', 'messages'], this.handleSocketMessage);
  }

  createMessagePane = () => {
    return (
      <div id="message-pane" style="visibility: hidden">
        <div className="header" id="messages-header">
          <div id="header-name"></div>
          <button id="close-button" onclick={() => {
            this.hide();
          }}>
            <img src={closeIcon} />
          </button>
        </div>
        <div className="messages" id="messages-container" />
        <div className="input" id="messages-input"></div>
      </div>
    );
  };

  handleSocketMessage = (msg) => {
    if (
      msg.type === 'message' &&
      (msg.from === this.recipient || msg.to === this.recipient)
    ) {
      this.messages.push(msg);
    } else if (msg.type === 'messages') {
      if (msg.recipient !== this.character.id) {
        return;
      }

      this.messages = msg.messages;
    }

    this.updateMessagesPane();
  };

  updateMessagesPane = (character) => {
    if (character !== undefined) {
      this.recipient = character.id;

      socket.send({
        type: 'get_messages',
        recipient: character.id,
      });

      document.getElementById('header-name').innerHTML = '';
      document.getElementById('header-name').appendChild(
        <p className="name">
          {character.name}
        </p>
      );

      document.getElementById('messages-input').innerHTML = '';
      document
        .getElementById('messages-input')
        .appendChild(
          <input
            type="text"
            placeholder={`Send a message to ${character.name}`}
            onkeydown={this.handleKeyDown}
          />
        );

      this.character = character;
      this.messages = [];
    }

    const root = <div />;

    this.messages.forEach((msg) => {
      const senderName =
        msg.from === this.character.id ? this.character.name : 'Me';
      root.appendChild(<p>{`${senderName}: ${msg.text}`}</p>);
    });

    const container = document.getElementById('messages-container');
    container.innerHTML = '';
    container.appendChild(root);
    container.scrollTop = container.scrollHeight - container.clientHeight;
  };

  handleKeyDown = (e) => {
    if (e.keyCode !== 13) {
      // Wasn't the enter key
      return;
    }

    socket.send({
      type: 'message',
      text: e.target.value,
      to: this.character.id,
    });

    e.target.value = '';
  };

  hide = () => {
    document.getElementById('message-pane').style.visibility = 'hidden';
    this.hidden = true;
  };

  show = () => {
    document.getElementById('message-pane').style.visibility = 'inherit';
    this.hidden = false;
  };

  isHidden = () => {
    return this.hidden;
  };
}

const messagePaneInstance = new MessagePane();
export default messagePaneInstance;
