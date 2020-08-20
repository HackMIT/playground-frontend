import './styles/settings.scss';
import './images/settingsicon.svg';
import './images/box.svg';
import './images/box-filled.svg';
import socket from './js/socket';

// eslint-disable-next-line
import createElement from './utils/jsxHelper';

class Settings {
  constructor() {
    this.musicMuted = false;
    this.soundMuted = false;
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
    socket.send(
      JSON.stringify({
        type: 'settings',
        settings: {
          musicMuted: this.musicMuted,
          soundMuted: this.soundMuted,
        },
      })
    );
  };

  createSettingsContent = () => {
    return (
      <div id="settings-text">
        <div id="settings-option">
          {this.musicMuted ? (
            <img id="settings-box" src="images/box-filled.svg" />
          ) : (
            <img id="settings-box" src="images/box.svg" />
          )}
          <button id="settings-music" onclick={this.handleMusicButton}>
            {this.musicMuted ? 'UNMUTE ALL MUSIC' : 'MUTE ALL MUSIC'}
          </button>
        </div>
        <div>
          <button id="settings-sound" onclick={this.handleSoundButton}>
            {this.soundMuted ? 'UNMUTE ALL SOUND' : 'MUTE ALL SOUND'}
          </button>
        </div>
      </div>
    );
  };

  createSettingsModal = () => {
    return (
      <div id="settings">
        <div id="root">
          <div class="settings-page">
            <div class="settings-header">
              {/* <img class="settings-gear" src="images/settingsicon.svg" />
                  <h1>SETTINGS</h1>
                  <img class="settings-gear" src="images/settingsicon.svg" /> */}
            </div>
            <div class="settings-list" id="settings-list">
              {this.createSettingsContent()}
            </div>
            <button class="settings-logout">LOGOUT</button>
          </div>
        </div>
      </div>
    );
  };
}

const settingsInstance = new Settings();
export default settingsInstance;
