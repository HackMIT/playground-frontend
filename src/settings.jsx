import './styles/settings.scss';
import './images/settingsicon.svg';
import './images/box.svg';
import './images/settingsclouds.svg';
import socket from './js/socket';

// eslint-disable-next-line
import createElement from './utils/jsxHelper';

class Settings {
  constructor() {
    this.musicMuted = false;
    this.soundMuted = false;
    this.twitterHandle = null;
  }

  handleMusicButton = () => {
    this.musicMuted = !this.musicMuted;
    this.updateSettingsContent();
  };

  handleSoundButton = () => {
    this.soundMuted = !this.soundMuted;
    this.updateSettingsContent();
  };

  updateSettingsContent = () => {
    const settingsList = document.getElementById('settings-list');
    settingsList.innerHTML = '';
    settingsList.appendChild(this.createSettingsContent());
    socket.send({
      type: 'settings',
      settings: {
        musicMuted: this.musicMuted,
        soundMuted: this.soundMuted,
      },
    });
  };

  updateProfileContent = (profileArea) => {
    const profileContent = document.getElementById(
      `settings-update-${profileArea}`
    ).value;
    socket.send({
      type: 'settings',
      [profileArea]: profileContent,
      settings: { twitterHandle: '' },
    });
  };

  createSettingsContent = () => {
    return (
      <div id="settings-text">
        <div id="settings-option">
          <div id="settings-box"></div>
          <button id="settings-button" onclick={this.handleMusicButton}>
            {this.musicMuted ? 'UNMUTE ALL MUSIC' : 'MUTE ALL MUSIC'}
          </button>
        </div>
        <div id="settings-option">
          <div id="settings-box"></div>
          <button id="settings-button" onclick={this.handleSoundButton}>
            {this.soundMuted ? 'UNMUTE ALL SOUND' : 'MUTE ALL SOUND'}
          </button>
        </div>
      </div>
    );
  };

  checkTweets = () => {
    const elem = document.getElementById('settings-twitter');
    this.twitterHandle = elem.value;
    socket.send({
      type: 'settings',
      checkTwitter: true,
      settings: {
        twitterHandle: this.twitterHandle,
      },
    });
  };

  handleLogOff = () => {
    localStorage.setItem('token', null);
    window.location.reload();
  };

  createSettingsModal = (settings) => {
    this.musicMuted = settings.musicMuted;
    this.soundMuted = settings.soundMuted;

    return (
      <div id="settings">
        <div id="root">
          <div class="settings-header" id="settings-header">
            <div id="settings-gear"></div>
            <h1>SETTINGS</h1>
            <div id="settings-gear"></div>
          </div>
          <div class="settings-list" id="settings-list">
            {this.createSettingsContent()}
          </div>
          <div id="settings-input">
            <label>Tweet with #HackMIT to earn an achievement: </label>
            <div>
              <input
                id="settings-twitter"
                type="text"
                placeholder="Twitter handle"
              />
              <button onclick={() => this.checkTweets()}>CHECK TWEETS</button>
            </div>
          </div>
          <div id="settings-update-profile">
            <div id="settings-update-item">
              <label>Update location:</label>
              <div>
                <input
                  type="text"
                  placeholder="Location"
                  id="settings-update-location"
                  maxLength="30"
                />
                <button onclick={() => this.updateProfileContent('location')}>
                  UPDATE
                </button>
              </div>
            </div>
            <div id="settings-update-item">
              <label>Update bio:</label>
              <div>
                <textarea
                  placeholder="Bio"
                  id="settings-update-bio"
                  rows="5"
                  maxLength="150"
                />
                <button onclick={() => this.updateProfileContent('bio')}>
                  UPDATE
                </button>
              </div>
            </div>
          </div>
          <div id="settings-flexcenter">
            <button id="settings-logout" onclick={this.handleLogOff}>
              LOG OFF
            </button>
          </div>
        </div>
        <div id="settings-clouds"></div>
      </div>
    );
  };
}

const settingsInstance = new Settings();
export default settingsInstance;
