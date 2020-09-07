/* eslint-disable no-multi-str */
import './styles/achievements.scss';
import './images/settingsicon.svg';
import './images/box.svg';
import './images/settingsclouds.svg';
// import socket from './js/socket';

// eslint-disable-next-line
import createElement from './utils/jsxHelper';

class Achievements {
  handleToggle = (id) => {
    
    try {
      const tileArrow = document.getElementById(id);
      tileArrow.classList.toggle("Achievement-tile-arrow-container-rotate");

      const tileBody = document.getElementById(`${id}-tile-body`);
      tileBody.classList.toggle("Achievement-tile-body");
      
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    
  };

  handleIntroToggle=()=>{

   const introBody = document.getElementById("achievement-intro-tile-body");
   introBody.classList.toggle("Achievement-intro-tile-body-text");


  }

  createAchievementsTile = (data) => {
    return (
      <div className="Achievement-tile-container">
        <div className="Achievement-tile-header">
          <div
            className="Achievement-tile-arrow"
          >
            <div
              className="Achievement-tile-arrow-container"
              id={data.title}
              onclick={()=>{this.handleToggle(data.title)}}
              style={`background-image:url(${data.img})`

            }
            ></div>
          </div>
          <div className="Achiement-tile-title">{data.title}</div>
          <div className="Achievement-tile-sticker"
          >
          <div className="Achievement-tile-sticker-container"
          style={`background-image:url(${data.sticker})`}
          >
          </div>
          </div>
        </div>
        <div id={`${data.title}-tile-body`} className="Achievement-tile-body-hide" >{data.blurb}</div>
      </div>
    );
  };

  createAchievementsIntroTile = () => {
    return (
      <div className="Achievements-intro-tile">
        <div className="Achievements-intro-tile-header">EXPLORER</div>
        <div className="Achievements-intro-tile-body">
          <div className="Achievement-intro-tile-body-title">
            COMPLETE YOUR SCRAPBOOK!
          </div>
          <div id="achievement-intro-tile-body" className="Achievement-intro-tile-body-text-hide">
            Are you a wilderness explorer in HackPlayground? In addition to
            meeting new people and building something cool, there’s a lot more
            exciting things you can do at HackMIT 2020! This is your guide to
            exploring all that we have to offer. It is also an empty scrapbook
            that you can fill up with stickers by participating in various
            events. With each space you fill up, you can earn a raffle ticket!
            Collect 5 or more for ~bonus~ tickets. Prizes include so get hyped
            :))
          </div>
          <div onclick={this.handleIntroToggle} className="Achievements-body-closing-container">
            <div className="Achievements-body-closing-container-tile"></div>
            <div className="Achievements-body-closing-container-tile"></div>
            <div className="Achievements-body-closing-container-tile"></div>
          </div>
        </div>
        {/* <div className="Achievement-intro"></div> */}
      </div>
    );
  };

  createAchievementsTilesContainer = (data) => {
    const AchievementsTiles = data.map((datapiece) =>
      this.createAchievementsTile(datapiece)
    );
    return (
      <div className="Achievements-Tiles-Container">{AchievementsTiles}</div>
    );
  };

  createAchievementsModal = () => {
    const achievements = [
      {
        title: 'COMPANY TOUR',
        blurb:
          'We have a lot of cool sponsors, and we’d love for you to meet them! Each company has its own lobby \
      and room specially designed for you to interact and learn more about them. Visit 3-4 companies and at least\
       one non-profit and come get your badge!',
        img: '../images/red_arrow.svg',
        sticker:'../images/company.svg'
      },
      {
        title: 'PEER EXPO',
        blurb:
          'Meet people from around the world and see their amazing projects! \
        Visit at least 3 other teams in Peer Expo and claim your sticker.',
        img: '../images/blue_arrow.svg',
        sticker:'../images/peerexpo.svg'
      },
      {
        title: 'HANGOUTS',
        // eslint-disable-next-line no-multi-str
        blurb:
          '\
          HackMIT 2020 is larger than ever! That means more people to interact with, more connections to make, more friendships to form.\
           Meet at least 5 other people to claim your sticker, one of them from a different country from you!',
        img: '../images/red_arrow.svg',
        sticker:'../images/meet.svg'
      },
    ];
    // eslint-disable-next-line no-console
    console.log(achievements);
    return (
      <div id="achievements">
        <div id="root"></div>
        {this.createAchievementsIntroTile()}
        {this.createAchievementsTilesContainer(achievements)}

        <div id="achievements-clouds"></div>
      </div>
    );
  };
}

const AchievementsInstance = new Achievements();
export default AchievementsInstance;
