function createMap(map) {
	console.log("inside createMap");
	map.on('load', function() {
		console.log("inside load map");
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
	});

	return map;
}

export default createMap;