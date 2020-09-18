import constants from '../../constants';
import socket from '../socket';

import '../../styles/dance.scss';

import flip from '../../images/icons/flipdark.svg'
import shoot from '../../images/icons/shoot.svg'
import clap from '../../images/icons/clap.svg'

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class DancePane {
  createDancePane = () => {
    return (
      <div id="dance-pane">
        <div id="dance-buttons-div">
          <div className="dance-buttons-row">
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
          </div>
          <div className="dance-buttons-row">
            <button
              className="dance-pane-button"
              id="dance-button-4"
              onclick={() => this.dance(constants.dances.backflip)}
            >
              <img id="flip-img" src={flip} />
            </button>
            <button
              className="dance-pane-button"
              id="dance-button-5"
              onclick={() => this.dance(constants.dances.clap)}
            >
              <img src={clap} />
            </button>
            <button
              className="dance-pane-button"
              id="dance-button-6"
              onclick={() => this.dance(constants.dances.shoot)}
            >
              <img id="shoot-img" src={shoot} />
            </button>
          </div>
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
