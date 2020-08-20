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
    socket.subscribe(['map'], this.registerLocation);
  }

  registerLocation = (data) => {
    // send update packet to backend
    // receive map packet from backend
    // update coordinates
    console.log('registering');

    const locs = [];
    console.log(data);

    // processing all map coordinates
    /*
      {
        type: 'map',
        locations: [
          'lat':
          'lng':
          'name':
        ]
      }
    */
    data.locations.forEach((element) => {
      const point = {
        type: 'Feature',
        geometry: {
          type: 'point',
          coordinates: [element.lat, element.lng],
        },
      };
      locs.push(point);
    });

    const src = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: locs,
      },
    };

    this.coordinates = src;
    console.log(this.coordinates);
  };

  createMap = (characterId) => {
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

    const navigationPanel = new mapboxgl.NavigationControl();

    map.addControl(geocoder);
    map.addControl(saveLocationButton, 'bottom-right');
    map.addControl(navigationPanel);

    map.on('load', () => {
      // Add an image to use as a custom marker
      map.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
          if (error) throw error;
          map.addImage('custom-marker', image);

          // request hacker coordinates
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

          // hackers who've already placed themselves: MAKE THIS URL RESPONSE LATER
          // map.addSource('points', this.coordinates);
          console.log(this.coordinates);

          map.addSource('hackers', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          });

          if (this.coordinates.length === 0) {
            console.log('the beginning');
            map.addSource('point', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [],
              },
            });
          } else {
            map.addSource(this.coordinates);
          }

          // how they'll be represented on
          map.addLayer({
            id: 'points',
            type: 'symbol',
            source: 'hackers',
          });

          console.log('added sources and layer');

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
  };
}

const mapInstance = new Map();
export default mapInstance;
