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
                <a
                  href="https://misti.mit.edu/student-programs/location/africa"
                  target="_blank"
                >
                  Africa
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/australia"
                  target="_blank"
                >
                  Australia
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/belgium"
                  target="_blank"
                >
                  Belgium
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/brazil"
                  target="_blank"
                >
                  Brazil
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/chile"
                  target="_blank"
                >
                  Chile
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/china"
                  target="_blank"
                >
                  China
                </a>
                <a className="spacer">hello</a>
              </div>
              <div className="misti-popup-locations-column">
                <a
                  href="https://misti.mit.edu/student-programs/location/denmark"
                  target="_blank"
                >
                  Denmark
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/france"
                  target="_blank"
                >
                  France
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/germany"
                  target="_blank"
                >
                  Germany
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/india"
                  target="_blank"
                >
                  India
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/israel"
                  target="_blank"
                >
                  Israel
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/italy"
                  target="_blank"
                >
                  Italy
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/japan"
                  target="_blank"
                >
                  Japan
                </a>
              </div>
              <div className="misti-popup-locations-column">
                <a
                  href="https://misti.mit.edu/student-programs/location/jordan"
                  target="_blank"
                >
                  Jordan
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/kazakhstan"
                  target="_blank"
                >
                  Kazakhstan
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/korea"
                  target="_blank"
                >
                  Korea
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/mexico"
                  target="_blank"
                >
                  Mexico
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/netherlands"
                  target="_blank"
                >
                  Netherlands
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/new-zealand"
                  target="_blank"
                >
                  New Zealand
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/peru"
                  target="_blank"
                >
                  Peru
                </a>
              </div>
              <div className="misti-popup-locations-column">
                <a
                  href="https://misti.mit.edu/student-programs/location/portugal"
                  target="_blank"
                >
                  Portugal
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/russia"
                  target="_blank"
                >
                  Russia
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/singapore"
                  target="_blank"
                >
                  Singapore
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/spain"
                  target="_blank"
                >
                  Spain
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/switzerland"
                  target="_blank"
                >
                  Switzerland
                </a>
                <a
                  href="https://misti.mit.edu/student-programs/location/united-kingdom"
                  target="_blank"
                >
                  United Kingdom
                </a>
                <a className="spacer">world</a>
              </div>
            </div>
          </div>
          <div className="misti-popup-resources links-container">
            <h2>Resources</h2>
            <div className="misti-popup-resources-buttons">
              <a href="https://misti.mit.edu/MISTI101" target="_blank">
                Learn More
              </a>
              <a href="https://misti.mit.edu/apply-now" target="_blank">
                Apply Now
              </a>
              <a href="https://misti.mit.edu/contact" target="_blank">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

const nonprofitPanelInstance = new NonprofitPopup();
export default nonprofitPanelInstance;
