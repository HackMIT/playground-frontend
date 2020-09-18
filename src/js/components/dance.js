import constants from '../../constants';
import socket from '../socket';

import '../../styles/dance.scss';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class DancePane {
  createDancePane = () => {
    return (
      <div id="dance-pane">
        <div id="dance-buttons-div">
          <button
            className="dance-pane-button"
            id="dance-button-1"
            onclick={() => this.dance(constants.dances.dab)}
          >
            <img id="dab-img" src="/images/icons/dab.svg" />
          </button>
          <button
            className="dance-pane-button"
            id="dance-button-2"
            onclick={() => this.dance(constants.dances.wave)}
          >
            <img src="/images/icons/wave.svg" />
          </button>
          <button
            className="dance-pane-button"
            id="dance-button-3"
            onclick={() => this.dance(constants.dances.floss)}
          >
            <img src="/images/icons/floss.svg" />
          </button>
          <button className="dance-pane-button" id="dance-button-4">
            <img src="/images/icons/dance.svg" />
          </button>
          <button className="dance-pane-button" id="dance-button-5">
            <img src="/images/icons/dance.svg" />
          </button>
          <button className="dance-pane-button" id="dance-button-6">
            <img src="/images/icons/dance.svg" />
          </button>
        </div>
        <div id="dance-pane-arrow" />
      </div>
    );
  };

  dance = (num) => {
    socket.send({
      type: 'dance',
      dance: num,
    });
  };
}

const dancePaneInstance = new DancePane();
export default dancePaneInstance;
