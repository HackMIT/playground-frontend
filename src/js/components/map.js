import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import '../../styles/map.scss';
import socket from '../socket';
import saveLocationButton from './saveLocationButton';

const MAPBOX_API_KEY =
  'pk.eyJ1IjoiaGFja21pdDIwIiwiYSI6ImNrZHVpaTk4dDE4Ym0yc255YzM3NGx0dGIifQ.XXstZ1xCBEqC-Wz4_EI8Pw';
const mapstyle = {
    style: 'mapbox://styles/mapbox/light-v10', 
    center: [-71.0942, 42.3601],
    zoom: 3,
    marker_color: '#fbcdc2',
    layer: {
      circle_color: '#001d55',
      circle_radius: 5,
      circle_stroke_color: '#ffdf3f',
      circle_stroke_width: 2
    }
}

class Map {
  constructor() {
    this.coordinates = [];
    mapboxgl.accessToken = MAPBOX_API_KEY;
    socket.subscribe('map', this.registerLocation);
    this.mapLoaded = false;
    this.locationsRetrieved = false;
  }

  registerLocation = (data) => {

    if (this.mapLoaded) {
      this.checksLoad(data.locations);
    } else {
      this.locations = data.locations;
    }
    this.locationsRetrieved = true;
  
  };

  checksLoad = (locations) => {

    this.map.getSource('hackers').setData({
      type: 'FeatureCollection',
      features: locations.map((location) => {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [location.lat, location.lng],
          },
          properties: {},
        };
      }), 
    });

  }

  createMap = (characterId) => {
    this.map = new mapboxgl.Map({
      container: 'map-frame',
      style: mapstyle.style,
      center: mapstyle.center,
      zoom: mapstyle.zoom,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: {
        color: mapstyle.marker_color,
      },
      mapboxgl,
    });

    const navigationPanel = new mapboxgl.NavigationControl();

    this.map.addControl(geocoder, 'top-left');
    this.map.addControl(saveLocationButton, 'bottom-right');
    this.map.addControl(navigationPanel, 'top-left');

    this.map.on('load', () => {
      // get coordinate data
      socket.send({
        type: 'get_map',
      });

      // pending search
      this.map.addSource('single-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // hackers who've already placed themselves
      if (this.coordinates.length === 0) {
        this.map.addSource('hackers', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });
      } else {
        this.map.addSource(this.coordinates);
      }

      // how stored hackers will be represented
      this.map.addLayer({
        id: 'hackers',
        type: 'circle',
        source: 'hackers',
        paint: {
          'circle-color': mapstyle.layer.circle_color,
          'circle-radius': mapstyle.layer.circle_radius,
          'circle-stroke-color': mapstyle.layer.circle_stroke_color,
          'circle-stroke-width': mapstyle.layer.circle_stroke_width,
        },
      });

      // handle searched locations
      geocoder.on('result', (e) => {
        const loc = e.result.geometry.coordinates;
        this.map.getSource('single-point').setData(e.result.geometry);
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

      // TODO: registerLocation finishes after this is called so coordinates aren't in right format yet
      if (this.locationsRetrieved) {
        this.checksLoad(this.locations);
      }

      this.mapLoaded = true;
    });

    // center the map on the clicked coordinates
    this.map.on('click', 'hackers', (e) => {
      this.map.flyTo({
        center: e.features[0].geometry.coordinates,
      });
    });

    this.map.on('mouseenter', 'hackers', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    this.map.on('mouseleave', 'hackers', () => {
      this.map.getCanvas().style.cursor = '';
    });
  };
}

const mapInstance = new Map();
export default mapInstance;
