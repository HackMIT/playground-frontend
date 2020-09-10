// import message from './message';
import '../../styles/dance.scss';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';
class DancePane {
  createDancePane = () => {
    // const messagesPane = message.createMessagePane();

    return (
      <div id="dance-pane">
        <div id="dance-buttons">
          <button id="dance-button-1">
            <img src="/images/icons/dance.svg" />
          </button>
          <button id="dance-button-2">
            <img src="/images/icons/dance.svg" />
          </button>
        </div>
        <div id="dance-pane-arrow" />
        {/* {messagesPane} */}
      </div>
    );
  };
}

const dancePaneInstance = new DancePane();
export default dancePaneInstance;