function createMap(map) {

	var geocoder = new MapboxGeocoder({
		accessToken: mapboxgl.accessToken,
		marker: {
			color: 'orange'
		},
		mapboxgl: mapboxgl
	});

	const saveLocationButton = new SaveLocationButton();
	map.addControl(saveLocationButton);
		
	map.addControl(geocoder);
	map.addControl(new mapboxgl.NavigationControl());
	
	map.on('load', function() {
		
		// Add an image to use as a custom marker
		map.loadImage(
			'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
			function(error, image) {
				if (error) throw error;
				map.addImage('custom-marker', image);
				
				map.addSource('single-point', {
					type: 'geojson',
					data: {
					  type: 'FeatureCollection',
					  features: []
					}
				});
				
				// Add a symbol layer
				map.addLayer({
					'id': 'points',
					'type': 'symbol',
					'source': 'points',
					'layout': {
						'icon-image': 'custom-marker',
					}
				});
				
				// handle searched locations
				geocoder.on('result', function(e) {
					console.log("searched");
					map.getSource('single-point').setData(e.result.geometry);

					// pin location
					var geojson = {
						type: "FeatureCollection",
						features: [{
							type:"Feature",
							geometry: { type: "Point", coordinates: [ e.lngLat.lng, e.lngLat.lat ]}
						}]
					};
					map.addSource("pins", {
						"type": "geojson",
						"data": geojson
					});
					map.addLayer({
						id: "pinsLayer",
						type: "circle",
						source: "pins", 
						paint: {
							"circle-color": "red",
							"circle-radius": 5 
						}
					});
				});

			}
		);

		// Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
		map.on('mouseenter', 'symbols', function() {
			console.log("hovering");
			map.getCanvas().style.cursor = 'pointer';
		});
		
		// Change it back to a pointer when it leaves.
		map.on('mouseleave', 'symbols', function() {
			console.log("left hover");
			map.getCanvas().style.cursor = '';
		});
	});
}

class SaveLocationButton {
	onAdd(map){
	  this.map = map;
	  this.container = document.createElement('div');
	  this.container.className = 'save-location';
	  
	  const button = this._createButton('save')
	  this.container.appendChild(button);

	  return this.container;
	}

	onRemove(){
	  this.container.parentNode.removeChild(this.container);
	  this.map = undefined;
	}

	_createButton(className) {
		const el = window.document.createElement('button')
		el.className = className;
		el.textContent = 'Save location';
		el.addEventListener('click', (e) => {
		  console.log(e);
		  // e.preventDefault()
		  e.stopPropagation()
		}, false)
		return el;
	}
}
  

export default createMap;