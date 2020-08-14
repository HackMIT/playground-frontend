import './styles/map.scss'

function createMap(map) {

	var geocoder = new MapboxGeocoder({
		accessToken: mapboxgl.accessToken,
		marker: {
			color: "#001d55"
		},
		mapboxgl: mapboxgl
	});

	const saveLocationButton = new SaveLocationButton();
		
	map.addControl(geocoder);
	map.addControl(saveLocationButton);
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
				
				// handle searched locations
				geocoder.on('result', function(e) {
					console.log("searched");
					if (e.result === "" || e.result === null) {
						window.document.getElementById("save").style.display = "none";
					}
					else {
						map.getSource('single-point').setData(e.result.geometry);
						window.document.getElementById("save").style.display = "block";
					}
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

	_createButton(idName) {
		const el = window.document.createElement('button')
		el.id = idName;
		el.textContent = "I'm here!";
		el.style.marginRight = "10px";
		el.style.display = "none";
		el.style.zIndex = -1;
		el.style.position = "relative";
		el.addEventListener("click", function() {
			console.log("do something")
		});
		return el;
	}
}
  

export default createMap;