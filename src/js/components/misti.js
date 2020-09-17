import '../../styles/misti.scss';

import '../../images/misti_popup_background.svg';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class NonprofitPopup {
  createModal = () => {
    return (
      <div id="misti-container">
        <div id="misti-popup">
          <div className="misti-popup-heading">
            <h1>MISTI</h1>
            <p>
              MISTI provides MIT students with the chance to gain hands-on,
              real-life work experience in leading companies and labs around the
              world. At no cost.
            </p>
          </div>
          <div className="misti-popup-locations links-container">
            <h2>Locations</h2>
            <div className="misti-popup-locations-container">
              <div className="misti-popup-locations-column">
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a className="spacer">hello</a>
              </div>
              <div className="misti-popup-locations-column">
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
              </div>
              <div className="misti-popup-locations-column">
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
              </div>
              <div className="misti-popup-locations-column">
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a href="#">Africa</a>
                <a className="spacer">world</a>
              </div>
            </div>
          </div>
          <div className="misti-popup-resources links-container">
            <h2>Resources</h2>
            <div className="misti-popup-resources-buttons">
              <a href="#">Learn More</a>
              <a href="#">Open Office Hours</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

const nonprofitPanelInstance = new NonprofitPopup();
export default nonprofitPanelInstance;
