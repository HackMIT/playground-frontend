import '../../styles/zoomBackgrounds.scss';
import downloadIcon from '../../images/icons/download.svg';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

const BASE_URL = 'https://blueprint-playground-2021.s3.amazonaws.com/zooms/';

class ZoomBackgroundsPanel {
  createZoomBackgroundsPanel = () => {
    const zoomBackgroundElems = [
      'background1.png',
      'background2.png',
      'background3.png',
      'background4.png',
      'background5.jpg',
      'background6.jpg',
      'background7.jpg',
      'background8.png',
      'background9.png',
      'background10.png',
      'background11.png',
    ].map((path) => (
      <div className="zoom-background">
        <a href={`${BASE_URL}${path}`} target="_blank">
          <div className="zoom-background-overlay">
            <img src={downloadIcon} />
          </div>
          <img className="zoom-background-img" src={`${BASE_URL}${path}`} />
        </a>
      </div>
    ));

    return (
      <div id="zoom-backgrounds-panel">
        <h1>Zoom Backgrounds</h1>
        <div className="border" />
        <p>Spice up your team calls with HackMIT-themed Zoom backgrounds!</p>
        <div className="zoom-backgrounds-container-container">
          <div className="zoom-backgrounds-container">
            {zoomBackgroundElems}
          </div>
        </div>
      </div>
    );
  };
}

const panel = new ZoomBackgroundsPanel();
export default panel;
