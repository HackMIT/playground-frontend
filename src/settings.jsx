import './styles/settings.scss';

// eslint-disable-next-line
import createElement from './utils/jsxHelper';

export default function createSettingsModal() {
  return (
    <div id="settings">
      <div id="sign-in">
        Sign in by using the following form (register by using postman oops):
        <form id="sign-in-form">
          Organization Name: <input id="name" /> <br />
          Id: <input id="id" /> <br />
          <input type="submit" id="sign-in-button" value="Sign in" />
        </form>
      </div>

      <br />
      <br />

      <div id="admin-panel">
        <div id="data-dump"></div>
        <div id="sponsor-name"></div>
        <div id="secret-id"></div>
        <div id="room-color"></div>
        <form id="change-color">
          <input id="new-color" value="New Color Hex Code" /> <br />
          <input type="submit" id="change-color-submit" value="Change color" />
        </form>
        <br />
        <br />

        <div id="upload-logo">
          <button id="upload-logo-button">
            Upload new logo (not functional)
          </button>
        </div>
        <br />
        <br />

        <div id="hacker-queue">Hacker queue: some axios request</div>
      </div>
    </div>
  );
}
