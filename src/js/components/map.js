import '../../styles/map.scss';

// eslint-disable-next-line
import socket from '../socket';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

import '../../images/map/Ground.svg';
import townSquare from '../../images/map/town_square.svg';

class Map {
  createMapModal = () => {
    return (
      <div id="map">
        <div id="map-container">
          <button id="town-square" onclick={() => this.teleport('home')}>
            <img src={townSquare} />
          </button>
        </div>
      </div>
    );
  };

  teleport = (room) => {
    document.getElementById('modal-background').remove();

    socket.send({
      type: 'teleport',
      to: room,
    });
  };
}

const mapInstance = new Map();
export default mapInstance;
