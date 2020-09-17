import YouTubeIframeLoader from 'youtube-iframe';
import swal from 'sweetalert';

import characterManager from './js/managers/character';
import socket from './js/socket';
import closeIcon from './images/icons/close.svg';
import './styles/jukebox.scss';

// eslint-disable-next-line
import createElement from './utils/jsxHelper';

class Jukebox {
  constructor() {
    this.songs = [];
    this.currentSong = null;
    this.songStart = 0;
    this.player = null;
    this.jukeboxToggle = true;

    socket.subscribe(
      ['song', 'error', 'songs', 'play_song'],
      this.handleSocketMessage
    );
  }

  handleSocketMessage = (msg) => {
    if (msg.type === 'songs') {
      this.songs = msg.songs;
    } else if (msg.type === 'play_song' && this.jukeboxToggle) {
      this.songStart = msg.start;
      if (this.player !== null && msg.song.id !== this.currentSong.id) {
        this.currentSong = msg.song;
        this.updateJukeboxPane(false);
        this.player.loadVideoById(msg.song.vidCode);
      } else {
        this.currentSong = msg.song;
        this.updateJukeboxPane(true);
      }
    } else if (msg.type === 'song' && msg.remove) {
      const index = this.songs.findIndex((x) => x.id === msg.id);
      this.songs.splice(index, 1);
      this.updateJukeboxPane(false);
    } else if (msg.type === 'song') {
      if (msg.requiresWarning) {
        swal(
          'Warning!',
          'You will be disqualified from HackMIT 2020 if you submit any inappropriate songs or videos. Please visit go.hackmit.org/coc for more details about our code of conduct.',
          'warning'
        );
      }
      this.songs.push(msg);
      this.updateJukeboxPane(false);
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

    const jukeboxElem = document.getElementById('jukebox-background');
    jukeboxElem.classList.remove('opening');
    jukeboxElem.classList.add('closing');

    setTimeout(() => {
      jukeboxElem.classList.remove('closing');
      jukeboxElem.style.display = 'none';
    }, 25);
  };

  createPlayingNowContents = () => {
    let title;
    if (this.currentSong.duration === 0) {
      title = 'None';
    } else {
      title = this.currentSong.title;
    }
    let input;
    if (this.jukeboxToggle) {
      input = <input onclick={this.toggleJukebox} id="jukebox-toggle" class="toggle" type="checkbox" checked />;
    }
    else {
      input = <input onclick={this.toggleJukebox} id="jukebox-toggle" class="toggle" type="checkbox" />
    }
    return (
      <div>
        <div>
          <p>Playing now:</p>
          <h2>{title}</h2>
        </div>
        <p id="toggle">Toggle Jukebox: </p>
        <label class="toggle">
          {input}
        </label>
      </div>
    );
  };

  toggleJukebox = () => {
    const toggle = document.getElementById('jukebox-toggle');
    this.jukeboxToggle = toggle.checked;
    if (toggle.checked && this.player !== null) {
      socket.send({
        type: 'get_current_song',
      });
      this.player.loadVideoById(this.currentSong.id, this.songStart);
    }
    else if (this.player !== null) {
      this.player.pauseVideo();
    }
  }

  createSongsQueueContents = () => {
    socket.send({
      type: 'get_songs',
    });
    const rootElem = <div />;
    setTimeout(() => {
      let removeButton;
      this.songs.forEach((song) => {
        if (characterManager.character.role === 1) { // user is an admin
          removeButton = <button id="remove" onclick={() => this.handleRemoveButton(song)}>Remove</button>;
        }
        else {
          removeButton = null;
        }
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
              {removeButton}
            </div>
          </div>
        );
      });
    }, 25);

    return rootElem;
  };

  openJukeboxPane = (rootElem) => {
    let jukeboxElem = document.getElementById('jukebox-background');
    if (jukeboxElem === null) {
      jukeboxElem = (
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
            <div id="jukebox-playing-now">
              <label class="volume">
                <input type="checkbox" />
              </label>
            </div>
            <div id="jukebox-songs-queue"></div>
            <div id="jukebox-controls">
              <p>Add a song to the queue:</p>
              <div>
                <input
                  id="jukebox-song-input"
                  type="text"
                  className="Jukebox-queue-container-controls-input"
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstleyVEVO"
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
    }

    socket.send({
      type: 'get_current_song',
    });
    socket.send({
      type: 'get_songs',
    });
    setTimeout(() => {
      jukeboxElem.classList.add('opening');
      jukeboxElem.style.display = 'flex';
      this.updateJukeboxPane(false);
    }, 25);
  };

  updateYouTubePlayer = () => {
    if (this.currentSong.duration === 0 || this.player !== null) {
      return;
    }

    setTimeout(() => {
      YouTubeIframeLoader.load((YT) => {
        this.player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: this.currentSong.vidCode,
          playerVars: {
            autoplay: 1,
            controls: 0,
            start: this.songStart,
            loop: 1,
          },
        });
      });
    }, 1);

    socket.send({
      type: 'get_songs',
    });
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

    let splitUrl;
    let vidCode;
    try {
      splitUrl = url.search.split(/[&=]/);
      if (url.toString().includes('&')) {
        vidCode = splitUrl[splitUrl.length - 3];
      }
      else {
        vidCode = splitUrl[splitUrl.length - 1];
      }
    }
    catch {
      swal('Oops!', 'Please input a valid YouTube video URL.', 'error');
      return;
    }

    socket.send({
      type: 'song',
      vidCode,
    });
  };

  handleRemoveButton = (song) => {
    const newSongPacket = { ...song };
    newSongPacket.remove = true;
    newSongPacket.type = 'song';
    socket.send(newSongPacket);
  };

  updateJukeboxPane = (updateVideo) => {
    // Get updated songs from queue
    if (updateVideo) {
      this.updateYouTubePlayer();
    }
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
