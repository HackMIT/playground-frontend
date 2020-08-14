function createMap(map) {
	
	map.on('load', function() {
		
		// Add an image to use as a custom marker
		map.loadImage(
			'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
			function(error, image) {
				if (error) throw error;
				map.addImage('custom-marker', image);
				// Add a GeoJSON source with 2 points
				map.addSource('points', {
					'type': 'geojson',
					'data': {
						'type': 'FeatureCollection',
						'features': [
							{
								// feature for Mapbox DC
								'type': 'Feature',
								'geometry': {
								'type': 'Point',
								'coordinates': [
									-77.03238901390978,
									38.913188059745586
									]
								},
								'properties': {
									'title': 'Mapbox DC'
								}
							},
						{
							// feature for Mapbox SF
							'type': 'Feature',
							'geometry': {
							'type': 'Point',
								'coordinates': [-122.414, 37.776]
							},
							'properties': {
								'title': 'Mapbox SF'
							}
						}]
					}
				});
				
				// Add a symbol layer
				map.addLayer({
					'id': 'points',
					'type': 'symbol',
					'source': 'points',
					'layout': {
						'icon-image': 'custom-marker',
						// get the title name from the source's "title" property
						'text-field': ['get', 'title'],
						'text-font': [
							'Open Sans Semibold',
							'Arial Unicode MS Bold'
						],
						'text-offset': [0, 1.25],
						'text-anchor': 'top'
					}
				});
			}
		);

		// Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
		map.on('click', 'symbols', function(e) {
			map.flyTo({
				center: e.features[0].geometry.coordinates
			});
		});
			
		// Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
		map.on('mouseenter', 'symbols', function() {
			map.getCanvas().style.cursor = 'pointer';
		});
		
		// Change it back to a pointer when it leaves.
		map.on('mouseleave', 'symbols', function() {
			map.getCanvas().style.cursor = '';
		});

		var geocoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			marker: {
				color: 'orange'
			},
			mapboxgl: mapboxgl
		});
			
		map.addControl(geocoder);
	});


	return map;
}

export default createMap;