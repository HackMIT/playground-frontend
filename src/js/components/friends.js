import characterManager from '../managers/character';

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
    socket.subscribe(['friend_update', 'status'], () => {
      // Quick hack -- we need the friend_update subscriber in characterManager to run first
      setTimeout(() => this.updateFriendsList(), 100);
    });
  }

  createFriendsPane = () => {
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
    let friendsListContainer = <div />;

    const friends = Array.from(characterManager.getFriends().values());

    if (friends.length === 0) {
      friendsListContainer = <div id="no-friends-container" />
      friendsListContainer.appendChild(
        <p id="no-friends">
          You have no friends :(
          <br />
          Try clicking someone to make a friend!</p>
      )
      return friendsListContainer;
    }

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
