import './styles/map.scss';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

class SaveLocationButton {
  onAdd(map) {
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'save-location';

    const button = this.createButton('save');
    this.container.appendChild(button);

    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }

  createButton = (idName) => {
    const el = window.document.createElement('button');
    el.id = idName;
    el.textContent = "I'm here!";
    el.style.marginRight = '10px';
    el.style.display = 'none';
    el.style.zIndex = 1000;
    el.style.position = 'relative';
    el.addEventListener('click', () => {
      console.log('do something');
    });
    return el;
  };
}

function createMap() {
  const map = new mapboxgl.Map({
    container: 'map-frame',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-71.0942, 42.3601],
    zoom: 7.5,
  });

  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: {
      color: '#001d55',
    },
    mapboxgl,
  });

  const saveLocationButton = new SaveLocationButton();

  map.addControl(geocoder);
  map.addControl(saveLocationButton);
  map.addControl(new mapboxgl.NavigationControl());

  map.on('load', () => {
    // Add an image to use as a custom marker
    map.loadImage(
      'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
      (error, image) => {
        if (error) throw error;
        map.addImage('custom-marker', image);

        map.addSource('single-point', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        // handle searched locations
        geocoder.on('result', (e) => {
          console.log('searched');
          if (e.result === '' || e.result === null) {
            window.document.getElementById('save').style.display = 'none';
          } else {
            map.getSource('single-point').setData(e.result.geometry);
            window.document.getElementById('save').style.display = 'block';
          }
        });
        // eslint-disable-next-line
      }
    );

    // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
    map.on('mouseenter', 'symbols', () => {
      console.log('hovering');
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'symbols', () => {
      console.log('left hover');
      map.getCanvas().style.cursor = '';
    });
  });
}

export default createMap;
