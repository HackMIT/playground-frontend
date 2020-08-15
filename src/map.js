import './styles/map.scss';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import createElement from './utils/jsxHelper';

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
    const el = (
      <button
        id={idName}
        textContent="I'm here!"
        style="margin-right:10px; display:none;"
      ></button>
    );
    el.addEventListener('click', (e) => {
      // TODO: create geojson object, send to backend later
      console.log(e);
    });
    return el;
  };
}

function registerLocation(map, coordinates) {
  // go to DB
  // add coordinate
  // backend updates URL response
  // grab from backend
  // plot points
  console.log('registering');
  //   map.addSource('points', {
  //     type: 'geojson',
  //     data: {
  //       type: 'FeatureCollection',
  //       features: [
  //         {
  //           type: 'Feature',
  //           properties: {},
  //           geometry: {
  //             type: 'Point',
  //             coordinates: [coordinates[0], coordinates[1]],
  //           },
  //         },
  //       ],
  //     },
  //   });
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
  const navigationPanel = new mapboxgl.NavigationControl();

  map.addControl(geocoder);
  map.addControl(saveLocationButton);
  map.addControl(navigationPanel);

  map.on('load', () => {
    // Add an image to use as a custom marker
    map.loadImage(
      'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
      (error, image) => {
        if (error) throw error;
        map.addImage('custom-marker', image);

        // pending search
        map.addSource('single-point', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        // hackers who've already placed themselves: MAKE THIS URL RESPONSE LATER
        map.addSource('points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        map.addLayer({
          id: 'hackers',
          type: 'symbol',
          source: 'points',
        });

        // handle searched locations
        geocoder.on('result', (e) => {
          console.log('searched: ' + e.result.geometry.coordinates);
          map.getSource('single-point').setData(e.result.geometry);
          window.document.getElementById('save').style.display = 'block';
          registerLocation(map, e.result.geometry.coordinates);
        });

        // remove "save location" button if nothing is searched
        geocoder.on('clear', (e) => {
          window.document.getElementById('save').style.display = 'none';
        });
      }
    );

    // TODO: this isn't working
    // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
    map.on('mouseenter', 'hackers', () => {
      console.log('hovering');
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'hackers', () => {
      console.log('left hover');
      map.getCanvas().style.cursor = '';
    });
  });
}

export default createMap;
