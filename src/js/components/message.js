import '../../styles/message.scss';

import socket from '../socket';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class MessagePane {
  constructor() {
    this.messages = [];

    socket.subscribe(['message', 'messages'], this.handleSocketMessage);
  }

  createMessagePane = () => {
    return (
      <div id="message-pane">
        <div className="header" id="messages-header"></div>
        <div className="messages" id="messages-container" />
        <div className="input" id="messages-input"></div>
      </div>
    );
  };

  handleSocketMessage = (msg) => {
    if (msg.type === 'message') {
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
      socket.send({
        type: 'get_messages',
        recipient: character.id,
      });

      document.getElementById('messages-header').innerHTML = '';
      document
        .getElementById('messages-header')
        .appendChild(<p className="name">{character.name}</p>);

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

    document.getElementById('messages-container').innerHTML = '';
    document.getElementById('messages-container').appendChild(root);
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
}

const messagePaneInstance = new MessagePane();
export default messagePaneInstance;
