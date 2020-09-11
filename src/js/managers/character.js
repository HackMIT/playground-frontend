import socket from '../socket';

class CharacterManager {
  constructor() {
    this.character = null;
    this.friends = new Map();

    socket.subscribe(
      ['friend_update', 'init', 'status'],
      this.handleSocketMessage
    );
  }

  handleSocketMessage = (msg) => {
    if (this.friends === undefined) {
      this.pendingMessages.push(msg);
      return;
    }

    switch (msg.type) {
      case 'friend_update': {
        if (!this.friends.has(msg.friend.id)) {
          this.friends.set(msg.friend.id, msg.friend);
        } else {
          const friend = this.friends.get(msg.friend.id);
          friend.teammate = msg.friend.teammate;
          friend.pending = msg.friend.pending;
          this.friends.set(msg.friend.id, friend);
        }
        break;
      }
      case 'init': {
        this.character = msg.character;

        this.friends = new Map();

        msg.friends.forEach((friend) => {
          console.log(friend);
          this.friends.set(friend.id, friend);
        });

        break;
      }
      case 'status': {
        if (this.friends.has(msg.id)) {
          const friend = this.friends.get(msg.id);
          // eslint-disable-next-line
          friend.status = msg.online ? (msg.active ? 0 : 1) : 2;
          this.friends.set(msg.id, friend);
        }

        break;
      }
      default:
        break;
    }
  };

  getSponsorId = () =>
    this.character === null ? null : this.character.sponsorId;

  getCharacterId = () => (this.character === null ? null : this.character.id);

  getFriends = () => this.friends;

  isTeammate = (characterId) => {
    return (
      this.friends.has(characterId) && this.friends.get(characterId).teammate
    );
  };

  isFriend = (characterId) => {
    return (
      this.friends.has(characterId) && !this.friends.get(characterId).pending
    );
  };
}

const manager = new CharacterManager();
export default manager;
