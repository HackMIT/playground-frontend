import '../../styles/arcade.scss';

import typeRacer from '../../images/games/typeracer.png';
import spyfall from '../../images/games/spyfall.png';
import set from '../../images/games/set.png';
import skribbl from '../../images/games/skribbl.png';
import lipoker from '../../images/games/lipoker.png';
import wikigame from '../../images/games/wikigame.png';
import crossword from '../../images/games/crossword.png';
import shellshock from '../../images/games/shellshock.png';
import bbo from '../../images/games/bbo.png';
import chess from '../../images/games/chess.png';
import clubpenguin from '../../images/games/clubpenguin.png';
import coolmath from '../../images/games/coolmath.png';
import '../../images/dots.svg';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class ArcadePanel {
  createArcadePanel = () => {
    return (
      <div id="arcade-panel">
        <div className="arcade-top-container">
          <h1>Welcome to the Arcade</h1>
        </div>
        <div className="arcade-games-container">
          <div className="game">
            <button
              onclick={() =>
                window.open('https://play.typeracer.com', '_blank')
              }
            >
              <img src={typeRacer} />
            </button>
            <p>Typeracer</p>
          </div>
          <div className="game">
            <button onclick={() => window.open('http://spyfall.app', '_blank')}>
              <img src={spyfall} />
            </button>
            <p>Spyfall</p>
          </div>
          <div className="game">
            <button
              onclick={() => window.open('http://setwithfriends.com', '_blank')}
            >
              <img src={set} />
            </button>
            <p>Set with Friends</p>
          </div>
          <div className="game">
            <button
              onclick={() =>
                window.open('https://www.bridgebase.com', '_blank')
              }
            >
              <img src={bbo} />
            </button>
            <p>Bridge</p>
          </div>
          <div className="game">
            <button onclick={() => window.open('https://chess.com', '_blank')}>
              <img src={chess} />
            </button>
            <p>Chess</p>
          </div>
          <div className="game">
            <button
              onclick={() => window.open('https://downforacross.com', '_blank')}
            >
              <img src={crossword} />
            </button>
            <p>Down for a Cross</p>
          </div>
          <div className="game">
            <button
              onclick={() => window.open('https://shellshock.io', '_blank')}
            >
              <img src={shellshock} />
            </button>
            <p>Shellshock.io</p>
          </div>
          <div className="game">
            <button onclick={() => window.open('https://skribbl.io', '_blank')}>
              <img src={skribbl} />
            </button>
            <p>Skribbl.io</p>
          </div>
          <div className="game">
            <button
              onclick={() => window.open('http://cprewritten.net', '_blank')}
            >
              <img src={clubpenguin} />
            </button>
            <p>Club Penguin</p>
          </div>
          <div className="game">
            <button onclick={() => window.open('http://lipoker.io', '_blank')}>
              <img src={lipoker} />
            </button>
            <p>Lipoker</p>
          </div>
          <div className="game">
            <button
              onclick={() => window.open('http://coolmathgames.com', '_blank')}
            >
              <img src={coolmath} />
            </button>
            <p>CoolMathGames</p>
          </div>
          <div className="game">
            <button
              onclick={() =>
                window.open('https://www.thewikigame.com', '_blank')
              }
            >
              <img src={wikigame} />
            </button>
            <p>The Wiki Game</p>
          </div>
        </div>
        <div className="arcade-bottom-container" />
      </div>
    );
  };
}

const panel = new ArcadePanel();
export default panel;
