import mapboxgl from 'mapbox-gl';

import '../../styles/map.scss';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import socket from '../socket';
import saveLocationButton from './saveLocationButton';

const MAPBOX_API_KEY =
  'pk.eyJ1IjoiaGFja21pdDIwIiwiYSI6ImNrZHVpaTk4dDE4Ym0yc255YzM3NGx0dGIifQ.XXstZ1xCBEqC-Wz4_EI8Pw';

class Map {
  constructor() {
    this.coordinates = [];
    mapboxgl.accessToken = MAPBOX_API_KEY;
    this.map = socket.subscribe(['map'], this.registerLocation);
  }

  registerLocation = (data) => {
    // receive map packet from backend
    // update coordinates
    const locs = [];

    // processing all map coordinates
    data.locations.forEach((element) => {
      const point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [element.lat, element.lng],
        },
        properties: {},
      };
      locs.push(point);
    });

    const src = {
      type: 'FeatureCollection',
      features: locs,
    };

    this.coordinates = src;
    // console.log(JSON.stringify(this.coordinates));
  };

  createMap = (characterId) => {
    const map = new mapboxgl.Map({
      container: 'map-frame',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-71.0942, 42.3601],
      zoom: 3,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: {
        color: '#fbcdc2',
      },
      mapboxgl,
    });

    const navigationPanel = new mapboxgl.NavigationControl();

    map.addControl(geocoder, 'top-left');
    map.addControl(saveLocationButton, 'bottom-right');
    map.addControl(navigationPanel, 'top-left');

    map.on('load', () => {
      // get coordinate data
      socket.send({
        type: 'get_map',
      });

      // pending search
      map.addSource('single-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // hackers who've already placed themselves
      if (this.coordinates.length === 0) {
        map.addSource('hackers', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });
      } else {
        map.addSource(this.coordinates);
      }

      // how stored hackers will be represented
      map.addLayer({
        id: 'hackers',
        type: 'circle',
        source: 'hackers',
        paint: {
          'circle-color': '#001d55',
          'circle-radius': 5,
          'circle-stroke-color': '#ffdf3f',
          'circle-stroke-width': 2,
        },
      });

      // handle searched locations
      geocoder.on('result', (e) => {
        const loc = e.result.geometry.coordinates;
        console.log(loc);
        map.getSource('single-point').setData(e.result.geometry);
        const saveButton = window.document.getElementById('save');
        saveButton.style.display = 'block';
        saveButton.addEventListener('click', () => {
          socket.send({
            type: 'update_map',
            location: {
              lat: loc[0],
              lng: loc[1],
              name: characterId,
            },
          });
        });
      });

      // remove "save location" button if nothing is searched
      geocoder.on('clear', () => {
        window.document.getElementById('save').style.display = 'none';
      });

      // update map constantly?
      window.setInterval(() => {
        map.getSource('hackers').setData(this.coordinates);
      }, 100);
    });

    // center the map on the clicked coordinates
    map.on('click', 'hackers', (e) => {
      map.flyTo({
        center: e.features[0].geometry.coordinates,
      });
    });

    map.on('mouseenter', 'hackers', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'hackers', () => {
      map.getCanvas().style.cursor = '';
    });
  };
}

const mapInstance = new Map();
export default mapInstance;
