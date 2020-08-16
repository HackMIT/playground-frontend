import YouTubeIframeLoader from 'youtube-iframe';

import './styles/jukebox.scss';

import closeIcon from './images/icons/close.svg';

// eslint-disable-next-line
import createElement from './utils/jsxHelper';

class Jukebox {
  constructor() {
    this.songs = [
      {
        title: 'Testing',
      },
    ];
  }

  closeJukeboxPane = (e) => {
    const allowedIDs = ['jukebox-background', 'jukebox-close-button'];

    if (
      !allowedIDs.includes(e.target.id) &&
      !allowedIDs.includes(e.target.parentElement.id)
    ) {
      return;
    }

    const jukeboxBackgroundElem = document.getElementById('jukebox-background');
    jukeboxBackgroundElem.classList.remove('opening');
    jukeboxBackgroundElem.classList.add('closing');

    setTimeout(() => {
      jukeboxBackgroundElem.remove();
    }, 250);
  };

  createPlayingNowContents = () => {
    return (
      <div>
        <p>Playing now (00:00 / 03:48):</p>
        <h2>Dominic Fike "3 Nights" (Official Audio)</h2>
      </div>
    );
  };

  createSongsQueueContents = () => {
    const rootElem = <div />;

    this.songs.forEach((song) => {
      rootElem.appendChild(
        <div className="jukebox-song">
          <p className="title">{song.title}</p>
        </div>
      );
    });

    return rootElem;
  };

  openJukeboxPane = (rootElem) => {
    const jukeboxElem = (
      <div id="jukebox-background" onclick={this.closeJukeboxPane}>
        <div id="jukebox-container" className="Jukebox-queue-container">
          <div className="jukebox-header">
            <div className="spacer" />
            <h2>Jukebox</h2>
            <button id="jukebox-close-button" onclick={this.closeJukeboxPane}>
              <img src={closeIcon} />
            </button>
          </div>
          <div id="player" />
          <div id="jukebox-playing-now"></div>
          <div id="jukebox-songs-queue"></div>
          <div id="jukebox-controls">
            <p>Add a song to the queue:</p>
            <div>
              <input
                id="jukebox-song-input"
                type="text"
                className="Jukebox-queue-container-controls-input"
                placeholder="https://youtube.com/dQw4w9WgXcQ"
              />
              <button
                id="jukebox-queue-button"
                className="Jukebox-queue-container-controls-input-button"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    rootElem.appendChild(jukeboxElem);

    setTimeout(() => {
      jukeboxElem.classList.add('opening');

      YouTubeIframeLoader.load((YT) => {
        this.player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: 'nb6ou_k4OzM',
          playerVars: {
            // autoplay: 1,
            controls: 0,
            start: 18,
          },
        });
      });

      this.updateJukeboxPane();
    }, 1);
  };

  updateJukeboxPane = () => {
    document.getElementById('jukebox-playing-now').innerHTML = '';
    document
      .getElementById('jukebox-playing-now')
      .appendChild(this.createPlayingNowContents());

    document.getElementById('jukebox-songs-queue').innerHTML = '';
    document
      .getElementById('jukebox-songs-queue')
      .appendChild(this.createSongsQueueContents());
  };
}

const jukeboxInstance = new Jukebox();
export default jukeboxInstance;
