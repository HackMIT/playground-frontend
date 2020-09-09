import '../../styles/map.scss';
// eslint-disable-next-line
import socket from '../socket';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class Map {

  createMapModal = () => {

    return <div id='map' />;
  };
}

const mapInstance = new Map();
export default mapInstance;
