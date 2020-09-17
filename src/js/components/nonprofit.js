import '../../styles/nonprofit.scss';
import wikipediaInfo from '../../images/wikipedia.png';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class NonprofitPopup {
  createNonprofitModal = (name) => {
    switch (name) {
      case 'wikimedia':
        return (
          <div id="nonprofit-popup">
            <img src={wikipediaInfo} />
          </div>
        );
      case 'humanitarian_ai':
        return (
          <div id="nonprofit-popup">
            <h1>Humanitarian AI</h1>
            <h3>Description</h3>
            <p>
              <b>Humanitarian AI</b> is collaborating with the{' '}
              <b>United Nations</b> to introduce HackMIT participants to
              humanitarian data sources and to mentor teams interested in
              potentially developing prototype open data driven humanitarian
              applications.
            </p>
            <br></br>
            <p>
              Humanitarian AI is a meetup.com community with local groups in
              twelve cities. The community was started by former United Nations
              staff to give students and AI developers opportunities to
              interface with humanitarian organizations, discuss artificial
              intelligence applications and work on volunteer projects advancing
              the humanitarian AI field.
            </p>
            <h3>Guiding Question</h3>
            <ul>
              <li>
                How can information streaming through open data sharing
                frameworks that are used by humanitarian organizations be
                leveraged for good in the digital AI age?
              </li>
            </ul>
            <h3>Resources</h3>
            <ul>
              <li>
                <a href="https://github.com/Humanitarian-AI/HACKMIT/blob/master/Humanitarian_Data_Sources.csv">
                  Humanitarian Data Sources:
                </a>{' '}
                How can information streaming through open data sharing
                frameworks that are used by humanitarian organizations be
                leveraged for good in the digital AI age?
              </li>
              <li>
                <a href="https://iatistandard.org/en/iati-tools-and-resources/">
                  IATI:
                </a>{' '}
                The International Aid Transparency Initiative
              </li>
              <li>
                <a href="https://data.humdata.org/">HDX:</a> The Humanitarian
                Data Exchange
              </li>
            </ul>
          </div>
        );
      case 'urban_displacement':
        return (
          <div id="nonprofit-popup">
            <h1>Urban Displacement Project</h1>
            <h3>Description</h3>
            <p>
              UDP conducts community-centered, data-driven, applied research toward more equitable and inclusive futures for cities. Our research aims to understand and describe the nature of gentrification and displacement, and also to generate knowledge on how policy interventions and investment can respond and support more equitable development.
            </p>
            <br></br>
            <p>
              The goal of UDP is to produce rigorous research and create tools to empower advocates and policymakers, to reframe conversations, and to train and inspire the next generation of leaders in equitable development.
            </p>
            <h3>Resources</h3>
            <ul>
              <li>
                <a href="https://www.sensitivecommunities.org/">
                  https://www.sensitivecommunities.org
                </a>{' '}
              </li>
              <li>
                Check out code on our github repo for identifying tract level locations of communities that are sensitive to displacement and housing cost increases
              </li>
            </ul>

          </div>
        );
      case 'kiva':
        return (
          <div id="nonprofit-popup">
            <h1>Kiva</h1>
            <h3>Description</h3>
            <p>
              Kiva works in more than 90 countries across the world, connecting
              entrepreneurs, single parents, farmers and students with lenders.
              Through our online marketplace, lenders read and connect with
              borrower’s stories and become part of their lives. We’ve been
              connecting the world for fifteen years and now, we want to see
              what you build to bring our mission of expanding financial access
              to help underserved communities thrive.
            </p>
            <h3>Guiding Question</h3>
            <p>How could….</p>
            <ul>
              <li>
                You map poverty on a city level? How would that change country
                to country?
              </li>
              <li>
                You measure the size of your farm without a land surveyor?
              </li>
              <li>You map clean water prices internationally?</li>
              <li>
                You develop an app to teach an illiterate person about debt,
                finance, or Kiva?
              </li>
              <li>
                You view a food product on your smartphone and search for Kiva
                borrowers selling that item?
              </li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };
}

const nonprofitPanelInstance = new NonprofitPopup();
export default nonprofitPanelInstance;
