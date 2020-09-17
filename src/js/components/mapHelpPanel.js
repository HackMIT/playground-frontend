// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class MapHelpPanel {
  onAdd(map) {
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl';

    const panel = this.createPanel('helpPanel');
    this.container.appendChild(panel);
    this.container.setAttribute("style", "background-color:rgba(256,256,256,0.6); padding:10px;")

    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }

  createPanel = (idName) => {
      const el = (
      <div
        id={idName}
          style={{ marginRight: "10px", display: "none", color:"black" }}
        >
          <div>Step 1: Search for your location</div>
          <div>Step 2: Click on your location</div>
          <div>Step 3: Click the "I'm here!" button on the bottom right</div>
      </div>
      );
    return el;
  };
}

const mapHelpPanel = new MapHelpPanel();
export default mapHelpPanel;