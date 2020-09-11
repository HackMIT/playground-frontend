import '../../styles/map.scss';

import socket from '../socket';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

import '../../images/map/Ground.svg';
import townSquare from '../../images/map/town_square.svg';
import townSquare2 from '../../images/map/town_square2.svg';
import nonprofit from '../../images/map/Nonprofit.svg';
import personalRoom from '../../images/map/personal_room.svg';
import sponsorTown from '../../images/map/sponsor_town.svg';
import speakerSign from '../../images/map/speaker_sign.svg';
import workshopSign from '../../images/map/workshop_sign.svg';
import eventSign from '../../images/map/event_sign.svg';

class Map {
  createMapModal = () => {
    return (
      <div id="map">
        <div id="map-container">
          <button id="town-square" onclick={() => this.teleport('home')}>
            <img src={townSquare} />
            <p class="label">{'Town Square'}</p>
          </button>
          <button
            id="town-square-2"
            onclick={() => this.teleport('plaza', 0.5694, 0.6962)}
          >
            <img src={townSquare2} />
            <p class="label">{'Hacker Plaza'}</p>
          </button>
          <button id="nonprofit" onclick={() => this.teleport('nonprofits')}>
            <img src={nonprofit} />
            <p class="label">{'Nonprofits'}</p>
          </button>
          <button id="personal-room" onclick={() => this.teleportPersonal()}>
            <img src={personalRoom} />
            <p class="label">{'Personal Room'}</p>
          </button>
          <button id="sponsor-town" onclick={() => this.teleport('plat_area')}>
            <img src={sponsorTown} />
            <p class="label">{'Sponsor Town'}</p>
          </button>
          <button
            id="speaker-sign"
            onclick={() => this.link('https://hackmit.org/')}
          >
            <img src={speakerSign} />
            <p class="label">{'Speakers'}</p>
          </button>
          <button
            id="workshop-sign"
            onclick={() => this.link('https://hackmit.org/')}
          >
            <img src={workshopSign} />
            <p class="label">{'Workshops'}</p>
          </button>
          <button
            id="event-sign"
            onclick={() => this.link('https://hackmit.org/')}
          >
            <img src={eventSign} />
            <p class="label">{'Events'}</p>
          </button>
        </div>
      </div>
    );
  };

  teleport = (room, x = 0.5, y = 0.5) => {
    document.getElementById('modal-background').remove();

    socket.send({
      type: 'teleport',
      to: room,
      x,
      y,
    });
  };

  teleportPersonal = () => {
    document.getElementById('modal-background').remove();

    socket.send({
      type: 'teleport_home',
    });
  };

  link = (url) => {
    document.getElementById('modal-background').remove();
    window.open(url);
  };
}

const mapInstance = new Map();
export default mapInstance;
