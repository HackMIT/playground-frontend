import YouTubeIframeLoader from 'youtube-iframe';
import swal from 'sweetalert';

import socket from './js/socket';
import closeIcon from './images/icons/close.svg';
import './styles/jukebox.scss';

// eslint-disable-next-line
import createElement from './utils/jsxHelper';

class Jukebox {
  constructor() {
    this.songs = [];

    socket.subscribe(['song', 'error'], this.handleSocketMessage);
  }

  handleSocketMessage = (msg) => {
    if (msg.type === 'song' && msg.remove) {
      const index = this.songs.findIndex(x => x.id === msg.id);
      this.songs.splice(index, 1);
      this.updateJukeboxPane();
    }
    else if (msg.type === 'song') {
      if (msg.requiresWarning) {
        swal("Warning!",
             "You will be disqualified from HackMIT 2020 if you submit any inappropriate songs or videos. Please visit go.hackmit.org/coc for more details about our code of conduct.",
             "warning");
      }
      this.songs.push(msg);
      this.updateJukeboxPane();
    } else if (msg.type === 'error') {
      if (msg.code === 400) {
        swal('Oops!', 'Your song must be less than 6 minutes long.', 'error');
      } else if (msg.code === 401) {
        swal(
          'Oops!',
          'You must wait at least 15 minutes between song submissions.',
          'error'
        );
      }
    }
  };

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
      const minutesStr = Math.floor(song.duration / 60)
        .toString()
        .padStart(2, '0');

      const secondsStr = (song.duration - Math.floor(song.duration / 60) * 60)
        .toString()
        .padStart(2, '0');

      rootElem.appendChild(
        <div className="jukebox-song">
          <img src={song.thumbnailUrl} />
          <div>
            <p className="title">{song.title}</p>
            <p className="duration">{`${minutesStr}:${secondsStr}`}</p>
            <button id="remove" onclick={() => this.handleRemoveButton(song)}>Remove</button>
          </div>
        </div>
      );
    });

    return rootElem;
  };

  openJukeboxPane = (rootElem) => {
    const jukeboxElem = (
      <div id="jukebox-background" onclick={this.closeJukeboxPane}>
        <div id="jukebox-container" className="Jukebox-queue-container">
          <div id="jukebox-header">
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
                onclick={this.handleSubmitButton}
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

  handleSubmitButton = () => {
    // Get YouTube video code
    let url;
    try {
      url = new URL(document.getElementById('jukebox-song-input').value);
    } catch (err) {
      swal('Oops!', 'Please input a valid YouTube video URL.', 'error');
      return;
    }

    if (
      url.hostname.toUpperCase() !== 'WWW.YOUTUBE.COM' &&
      url.hostname.toUpperCase() !== 'YOUTUBE.COM'
    ) {
      swal('Oops!', 'Please input a valid YouTube video URL.', 'error');
      return;
    }

    const splitUrl = url.search.split('=');
    const vidCode = splitUrl[splitUrl.length - 1];

    socket.send({
      type: 'song',
      vidCode,
    });
  };

  handleRemoveButton = (songPacket) => {
    const newSongPacket = { ...songPacket};
    newSongPacket.remove = true;
    socket.send(newSongPacket);
  }

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
