// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class MapHelpPanel {
  onAdd(map) {
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl';

    const panel = this.createPanel('helpPanel');
    this.container.appendChild(panel);
    this.container.setAttribute(
      'style',
      'background-color:rgba(255,255,255,0.8); font-size:16px; padding:10px;'
    );

    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }

  createPanel = (idName) => {
    return (
      <div id={idName}>
        <div>Step 1: Search for your location</div>
        <div>Step 2: Select your location from the results</div>
        <div>Step 3: Click the "I'm here!" button on the bottom right</div>
      </div>
    );
  };
}

const mapHelpPanel = new MapHelpPanel();
export default mapHelpPanel;
