/* eslint-disable no-multi-str */
import '../../styles/achievements.scss';
import '../../images/settingsicon.svg';
import '../../images/box.svg';
import '../../images/settingsclouds.svg';
import hangOuts from '../../images/explorer/meet.svg';
import companyTour from '../../images/explorer/company.svg';
import peerExpo from '../../images/explorer/peerexpo.svg';
import hackWeek from '../../images/explorer/hackweek.svg';
import map from '../../images/explorer/map.svg';
import memeLord from '../../images/explorer/memelord.svg';
import miniEvents from '../../images/explorer/minievents.svg';
import socialMedia from '../../images/explorer/socialmedia.svg';
import trackCounter from '../../images/explorer/trackcounter.svg';
import coffeeChat from '../../images/explorer/coffeechat.svg';
import redArrow from '../../images/arrows/red_arrow.svg';
import yellowArrow from '../../images/arrows/yellow_arrow.svg';
import blueArrow from '../../images/arrows/blue_arrow.svg';

// import socket from './js/socket';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

const achievements = [
  {
    title: 'COMPANY TOUR',
    blurb:
      'We have a lot of cool sponsors, and we’d love for you to meet them! Each company has its own lobby \
  and room specially designed for you to interact and learn more about them. Visit 3-4 companies and at least\
   one non-profit and come get your badge!',
    img: redArrow,
    sticker: companyTour,
    variableName: 'companyTour',
  },
  {
    title: 'PEER EXPO',
    blurb:
      'Meet people from around the world and see their amazing projects! \
    Visit at least 3 other teams in Peer Expo and claim your sticker.',
    img: yellowArrow,
    sticker: peerExpo,
    variableName: 'peerExpo',
  },
  {
    title: 'HANGOUTS',
    blurb:
      '\
      HackMIT 2020 is larger than ever! That means more people to interact with, more connections to make, more friendships \
      to form. Meet new friends by adding at least 5 other people, one of them from\
      a different country from you, to your friends list. Once they add you back, you can claim your sticker!',
    img: blueArrow,
    sticker: hangOuts,
    variableName: 'hangouts',
  },
  {
    title: 'WORKSHOPS',
    blurb:
      'Hack2020 isn’t just about the projects! Attend at least two talks and one workshop from during the weekend to earn this sticker.',
    img: redArrow,
    sticker: hackWeek,
    variableName: 'workshops',
  },
  {
    title: 'PUB HACK ON SOCIAL MEDIA',
    blurb:
      "Share your HackMIT experience on social media with our hashtag, #HackMIT2020! Inflict some #fomo on the rest of the world. Once you've done this task, submit your Twitter handle in the settings panel to claim your badge!",
    img: yellowArrow,
    sticker: socialMedia,
    variableName: 'socialMedia',
  },
  {
    title: 'MEME LORD',
    blurb:
      "Want to battle it out for the ultimate prize and become “Meme Lord”?  Submit a meme to our meme challenge by Tweeting it with #hackmitmemes, and get a sticker for participating. Also, winners of the meme challenge get cool prizes. Once you've done this task, submit your Twitter handle in the settings panel to claim your badge!",
    img: blueArrow,
    sticker: memeLord,
    variableName: 'memeLord',
  },
  {
    title: 'SPONSOR CHATS',
    blurb:
      'Would you like to know more about a company/sponsor? Hop into one of their rooms in Playground and click their “talk to” button to learn more about the cool \
      products they have in store and what they are currently working on. Chat with at least one company to earn a sticker.',
    img: redArrow,
    sticker: coffeeChat,
    variableName: 'sponsorQueue',
  },
  {
    title: 'SEND ME YOUR LOCATION',
    blurb:
      'Pin your location on the world map on Playground and mark your presence in the global village. See where other fellow hackers are from and appreciate how technology has made us more connected. Basically,"Send me your location, let’s focus on communicatin’...” Khalid, Location (song).',
    img: yellowArrow,
    sticker: map,
    variableName: 'sendLocation',
  },
  {
    title: 'TRACK COUNTER',
    blurb:
      'Be sure to choose to your track of choice before the Friday and Saturday deadlines. Submit your choice to the online Track Counter to get a sticker.',
    img: redArrow,
    sticker: trackCounter,
    variableName: 'trackCounter',
  },
  {
    title: 'MINI EVENTS',
    blurb:
      'Have fun at a mini-event! We’ve got a whole bunch of fun events so you can take a break from hacking! Put some work in with the “Abs with Jenny” workout session or our TikTok/Dance workshops. Put your mind to the test with some trivia/kahoot, or potentially meet the love of your “hack life”  in our “Hack Blind Dating”. Get up, take a stretch, and relax - you’ll get a sticker for attending any of these events!',
    img: yellowArrow,
    sticker: miniEvents,
    variableName: 'miniEvents',
  },
];
class Achievements {
  handleToggle = (id) => {
    // rotating arrows
    const tileArrow = document.getElementById(id);
    tileArrow.classList.toggle('Achievement-tile-arrow-container-rotate');

    const tileBody = document.getElementById(`${id}-tile-body`);
    tileBody.classList.toggle('Achievement-tile-body');
  };

  handleIntroToggle = () => {
    // hiding intro-description
    const introBody = document.getElementById('achievement-intro-tile-body');
    introBody.classList.toggle('Achievement-intro-tile-body-text');
    const achievementsRecord = document.getElementById('records-container');
    achievementsRecord.classList.toggle('Achievements-records-container');
  };

  createAchievementsIntroTile = (tasksCompleted) => {
    // create the introduction tile which describes what explorer is all about
    return (
      <div className="Achievements-intro-tile">
        <div className="Achievements-intro-tile-header">EXPLORER</div>
        <div className="Achievements-intro-tile-body">
          <div className="Achievement-intro-tile-body-title">
            COMPLETE YOUR SCRAPBOOK!
          </div>
          <div
            id="achievement-intro-tile-body"
            className="Achievement-intro-tile-body-text-hide"
          >
            Are you a wilderness explorer in HackPlayground? In addition to
            meeting new people and building something cool, there’s a lot more
            exciting things you can do at HackMIT 2020! This is your guide to
            exploring all that we have to offer. It is also an empty scrapbook
            that you can fill up with stickers by participating in various
            events. With each space you fill up, you can earn a raffle ticket!
            Prizes include ..... so get hyped :))
          </div>
          {this.createAchievementsRecord(achievements, tasksCompleted)}
          <div
            onclick={() => this.handleIntroToggle()}
            className="Achievements-body-closing-container"
          >
            <div className="Achievements-body-closing-container-tile"></div>
            <div className="Achievements-body-closing-container-tile"></div>
            <div className="Achievements-body-closing-container-tile"></div>
          </div>
        </div>
      </div>
    );
  };

  createAchievementsRecord = (achievementsData, tasksCompleted) => {
    // creates sticker scrapbook in intro-tile
    // fills in stickers based on whether the task has been completed
    const AchievementsRecord = achievementsData.map((data) =>
      this.createAchievementRecordTile(data, tasksCompleted)
    );
    return (
      <div
        id="records-container"
        className="Achievements-records-container-hide"
      >
        {AchievementsRecord}
      </div>
    );
  };

  createAchievementRecordTile = (data, tasksCompleted) => {
    // create a sticker tile in createAchievementsRecord above
    // fills in the sticker based on whether the task has been completed
    // eslint-disable-next-line prefer-destructuring
    let sticker = data.sticker;
    if (!tasksCompleted[data.variableName]) {
      sticker = '';
    }
    return (
      <div className="Achievement-tile-sticker">
        <div
          className="Achievement-tile-sticker-container"
          style={`background-color:#ededed;background-image:url(${sticker})`}
        ></div>
      </div>
    );
  };

  createAchievementsTile = (data, tasksCompleted) => {
    // creates a tile for each explorer task

    let stickerStyle = `
    background-image : url(${data.sticker});
    filter:grayscale(100%);
    `;

    if (tasksCompleted[data.variableName]) {
      stickerStyle = `background-image : url(${data.sticker});
        `;
    }

    const title = data.title.replace(' ', '_').toLowerCase();

    return (
      <div className="Achievement-tile-container">
        <div className="Achievement-tile-header">
          <div className="Achievement-tile-arrow">
            <div
              className="Achievement-tile-arrow-container"
              id={title}
              onclick={() => {
                this.handleToggle(title);
              }}
              style={`background-image:url(${data.img})`}
            ></div>
          </div>
          <div className="Achievement-tile-titleandsticker">
            <div className="Achievement-tile-title">{data.title}</div>
            <div className="Achievement-tile-sticker">
              <div
                className="Achievement-tile-sticker-container"
                style={stickerStyle}
              ></div>
            </div>
          </div>
        </div>
        <div id={`${title}-tile-body`} className="Achievement-tile-body-hide">
          {data.blurb}
        </div>
      </div>
    );
  };

  createAchievementsTilesContainer = (tasksCompleted) => {
    // houses all the tasks for explorer
    // each task is a "tile" like the one above
    const AchievementsTiles = achievements.map((datapiece) =>
      this.createAchievementsTile(datapiece, tasksCompleted)
    );
    return (
      <div className="Achievements-Tiles-Container">{AchievementsTiles}</div>
    );
  };

  createAchievementsModal = (tasksCompleted) => {
    return (
      <div id="achievements">
        <div id="root"></div>
        {this.createAchievementsIntroTile(tasksCompleted)}
        {this.createAchievementsTilesContainer(tasksCompleted)}
        <div id="achievements-clouds"></div>
      </div>
    );
  };
}

const AchievementsInstance = new Achievements();
export default AchievementsInstance;
