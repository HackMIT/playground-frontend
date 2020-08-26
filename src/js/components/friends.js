import message from './message';
import socket from '../socket';

import '../../styles/friends.scss';
import closeIcon from '../../images/icons/close-white.svg';
import messageIcon from '../../images/icons/message.svg';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class FriendsPane {
  constructor() {
    this.friends = new Map();

    socket.subscribe('join', this.handleSocketMessage);
  }

  handleSocketMessage = (msg) => {
    if (msg.type === 'join') {
      this.friends.set(msg.character.id, {
        id: msg.character.id,
        name: msg.character.name,
        school: 'MIT',
        teammate: true,
        status: 2,
      });

      this.updateFriendsList();
    }
  };

  createFriendsPane = (characters) => {
    characters.forEach((character) => {
      this.friends.set(character.id, {
        id: character.id,
        name: character.name,
        school: 'MIT',
        teammate: true,
        status: 2,
      });
    });

    const messagesPane = message.createMessagePane();

    return (
      <div id="friends-pane">
        <div id="friends-list">{this.friendsListContents()}</div>
        <div id="friends-pane-arrow" />
        {messagesPane}
      </div>
    );
  };

  friendsListContents = () => {
    const friendsListContainer = (
      <div>
        <p className="header">Teammates</p>
      </div>
    );

    const friends = Array.from(this.friends.values());

    friends.sort((a, b) => {
      if (a.teammate && !b.teammate) {
        return -1;
      }

      if (b.teammate && !a.teammate) {
        return 1;
      }

      if (a.status > b.status) {
        return 1;
      }

      if (b.status > a.status) {
        return -1;
      }

      return 0;
    });

    let createdFriendsHeader = false;

    friends.forEach((friend) => {
      if (!friend.teammate && !createdFriendsHeader) {
        friendsListContainer.appendChild(<p className="header">Friends</p>);
        createdFriendsHeader = true;
      }

      let status = 'online';

      if (friend.status === 1) status = 'away';
      else if (friend.status === 2) status = 'offline';

      friendsListContainer.appendChild(
        <div className="friend">
          <div className={`indicator ${status}`} />
          <div className="contents">
            <p className="name">{friend.name}</p>
            <p className="school">{friend.school}</p>
          </div>
          <div className="buttons">
            <button>
              <img src={closeIcon} />
            </button>
            <button onclick={() => this.handleChatButton(friend)}>
              <img src={messageIcon} />
            </button>
          </div>
        </div>
      );
    });

    return friendsListContainer;
  };

  updateFriendsList = () => {
    if (document.getElementById('friends-list') === null) {
      return;
    }

    document.getElementById('friends-list').innerHTML = '';
    document
      .getElementById('friends-list')
      .appendChild(this.friendsListContents());
  };

  handleChatButton = (friend) => {
    message.updateMessagesPane(friend);
  };
}

const friendsPaneInstance = new FriendsPane();
export default friendsPaneInstance;
