import '../../styles/friends.scss';

import closeIcon from '../../images/icons/close-white.svg';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class FriendsPane {
  constructor() {
    this.friends = [
      {
        name: 'Hannah Liu',
        school: 'University of Texas, Houston',
        teammate: false,
        status: 0,
      },
      {
        name: 'Jamie Fu',
        school: 'University of Michigan',
        teammate: true,
        status: 0,
      },
      {
        name: 'Justin Yu',
        school: 'MIT',
        teammate: false,
        status: 1,
      },
      {
        name: 'Angela Zhang',
        school: 'University of Texas, Austin',
        teammate: false,
        status: 2,
      },
      {
        name: 'Nadia Waid',
        school: 'Iowa College',
        teammate: false,
        status: 0,
      },
    ];
  }

  createFriendsPane = () => {
    return (
      <div id="friends-pane">
        <div id="friends-list">{this.friendsListContents()}</div>
        <div id="friends-pane-arrow" />
      </div>
    );
  };

  friendsListContents = () => {
    const friendsListContainer = (
      <div>
        <p className="header">Teammates</p>
      </div>
    );

    this.friends.sort((a, b) => {
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

    this.friends.forEach((friend) => {
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
          </div>
        </div>
      );
    });

    return friendsListContainer;
  };
}

const friendsPaneInstance = new FriendsPane();
export default friendsPaneInstance;
