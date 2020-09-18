

import '../../styles/arcade.scss';

import typeRacer from '../../images/games/typeracer.png'
import spyfall from '../../images/games/spyfall.png'
import set from '../../images/games/set.png'
import skribbl from '../../images/games/skribbl.png'
import lipoker from '../../images/games/lipoker.png'
import wikigame from '../../images/games/wikigame.png'
import crossword from '../../images/games/crossword.png'
import shellshock from '../../images/games/shellshock.png'
import bbo from '../../images/games/bbo.png'
import chess from '../../images/games/chess.png'
import clubpenguin from '../../images/games/clubpenguin.png'
import coolmath from '../../images/games/coolmath.png'

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class ArcadePanel {
  createArcadePanel = () => {
    return (
      <div id="arcade-panel">
        <h1>Welcome to the Arcade</h1>
        <div id="games">
          <div class="game">
            <button id="typeracer">
              <img src={typeRacer} />
            </button>
            <p>Typeracer</p>
          </div>
          <div class="game">
            <button id="spyfall">
              <img src={spyfall} />
            </button>
            <p>Spyfall</p>
          </div>
          <div class="game">
            <button id="set">
              <img src={set} />
            </button>
            <p>Set with Friends</p>
          </div>
          <div class="game">
            <button id="bbo">
              <img src={bbo} />
            </button>
            <p>Bridge</p>
          </div>
          <div class="game">
            <button id="chess">
              <img src={chess} />
            </button>
            <p>Chess</p>
          </div>
          <div class="game">
            <button id="crossword">
              <img src={crossword} />
            </button>
            <p>Crossword</p>
          </div>
        </div>
        <div class="game">
          <button id="shellshock">
            <img src={shellshock} />
          </button>
          <p>Shellshock.io</p>
        </div>
        <div class="game">
          <button id="skribbl">
            <img src={skribbl} />
          </button>
          <p>Skribbl.io</p>
        </div>
        <div class="game">
          <button id="clubpenguin">
            <img src={clubpenguin} />
          </button>
          <p>Club Penguin</p>
        </div>
        <div class="game">
          <button id="lipoker">
            <img src={lipoker} />
          </button>
          <p>Lipoker</p>
        </div>
        <div class="game">
          <button id="coolmath">
            <img src={coolmath} />
          </button>
          <p>CoolMathGames</p>
        </div>
        <div class="game">
          <button id="wikigame">
            <img src={wikigame} />
          </button>
          <p>The Wiki Game</p>
        </div>
      </div>

    )
  }
}

const panel = new ArcadePanel();
export default panel;