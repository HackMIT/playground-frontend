import message from './message';
import socket from '../socket';

import '../../styles/friends.scss';
import addFriendIcon from '../../images/icons/add-friend.svg';
import closeIcon from '../../images/icons/close-white.svg';
import messageIcon from '../../images/icons/message.svg';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class FriendsPane {
  constructor() {
    this.friends = new Map();

    socket.subscribe(['friends', 'friend_update'], this.handleSocketMessage);
  }

  handleSocketMessage = (msg) => {
    switch (msg.type) {
      case 'friends': {
        this.friends = new Map();

        msg.friends.forEach((friend) => {
          this.friends.set(friend.id, friend);
        });

        this.updateFriendsList();

        break;
      }
      case 'friend_update': {
        if (!this.friends.has(msg.friend.id)) {
          this.friends.set(msg.friend.id, msg.friend);
        } else {
          const friend = this.friends.get(msg.friend.id);
          friend.teammate = msg.friend.teammate;
          friend.pending = msg.friend.pending;
          this.friends.set(msg.friend.id, friend);
        }

        this.updateFriendsList();
        break;
      }
      case 'join':
        this.friends.set(msg.character.id, {
          id: msg.character.id,
          name: msg.character.name,
          school: 'MIT',
          teammate: true,
          status: 2,
        });

        this.updateFriendsList();
        break;
      default:
        break;
    }
  };

  createFriendsPane = (characters) => {
    console.log(characters);

    socket.send({
      type: 'get_friends',
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
    const friendsListContainer = <div></div>;

    const friends = Array.from(this.friends.values());

    friends.sort((a, b) => {
      if (a.teammate && !b.teammate) {
        return -1;
      }

      if (b.teammate && !a.teammate) {
        return 1;
      }

      if (a.pending && !b.pending) {
        return 1;
      }

      if (b.pending && !a.pending) {
        return -1;
      }

      if (a.status > b.status) {
        return 1;
      }

      if (b.status > a.status) {
        return -1;
      }

      return 0;
    });

    let createdTeammatesHeader = false;
    let createdFriendsHeader = false;
    let createdRequestsHeader = false;

    friends.forEach((friend) => {
      if (friend.teammate && !createdTeammatesHeader) {
        friendsListContainer.appendChild(<p className="header">Teammates</p>);
        createdTeammatesHeader = true;
      }

      if (!friend.teammate && !friend.pending && !createdFriendsHeader) {
        friendsListContainer.appendChild(<p className="header">Friends</p>);
        createdFriendsHeader = true;
      }

      if (friend.pending && !createdRequestsHeader) {
        friendsListContainer.appendChild(
          <p className="header">Pending Requests</p>
        );
        createdRequestsHeader = true;
      }

      let status = 'online';

      if (friend.status === 1) status = 'away';
      else if (friend.status === 2) status = 'offline';

      let buttons;

      if (friend.pending) {
        buttons = (
          <div className="buttons">
            <button
              onclick={() => {
                socket.send({
                  type: 'friend_request',
                  recipientId: friend.id,
                });
              }}
            >
              <img src={addFriendIcon} />
            </button>
          </div>
        );
      } else {
        buttons = (
          <div className="buttons">
            <button>
              <img src={closeIcon} />
            </button>
            <button onclick={() => this.handleChatButton(friend)}>
              <img src={messageIcon} />
            </button>
          </div>
        );
      }

      friendsListContainer.appendChild(
        <div className="friend">
          <div className={`indicator ${status}`} />
          <div className="contents">
            <p className="name">{friend.name}</p>
            <p className="school">{friend.school}</p>
          </div>
          {buttons}
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
    if (this.selectedId === friend.id) {
      message.hide();
      return;
    }

    this.selectedId = friend.id;

    message.show();
    message.updateMessagesPane(friend);
  };
}

const friendsPaneInstance = new FriendsPane();
export default friendsPaneInstance;
