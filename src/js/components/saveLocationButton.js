// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

class SaveLocationButton {
  onAdd(map) {
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl save-location';

    const button = this.createButton('save');
    this.container.appendChild(button);

    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }

  createButton = (idName) => {
      const el = (
      <button
        id={idName}
        textContent="I'm here!"
        style={{ marginRight: "10px", display: "none" }}
      />
    );
    return el;
  };
}

const saveLocationButton = new SaveLocationButton();
export default saveLocationButton;