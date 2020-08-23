import './styles/settings.scss';
import './images/settingsicon.svg';
import './images/box.svg';
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

  createSettingsModal = () => {
    return (
      <div id="settings">
        <div id="root">
          <div class="settings-header" id="settings-header">
            {/* <img class="settings-gear" src="images/settingsicon.svg" /> */}
            <div id="settings-gear"></div>
            <h1>SETTINGS</h1>
            <div id="settings-gear"></div>
          </div>
          <div class="settings-list" id="settings-list">
            {this.createSettingsContent()}
          </div>
          <div id="settings-flexcenter">
            <button id="settings-logout">LOG OFF</button>
          </div>
        </div>
      </div>
    );
  };
}

const settingsInstance = new Settings();
export default settingsInstance;
