import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { AnimatedModel } from './AnimatedModel'
import { LinearAnimation } from './Animations'

const d = 20; // this controls scale of camera

class Scene3D {
	constructor() {
		this.container = document.createElement( 'div' );
		this.container.id = 'three-container'
	    document.getElementById('game').appendChild( this.container );

	    // Isometric Camera
	    var aspect = this.container.clientWidth / this.container.clientHeight;
	    this.camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
	    
	    this.camera.position.set( 20, 20, 20 ); // these need to all be equal?
	    this.camera.lookAt(0, 0, 0 );

	    // set up for ray casting
	    this.raycaster = new THREE.Raycaster();
	   	this.mouse = new THREE.Vector2();
	    this.clock = new THREE.Clock();
	    this.scene = new THREE.Scene();

	    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
	    this.scene.add(light);

	    this.loader = new GLTFLoader().setPath( 'assets/models/' );

	    this.characters = new Map();

	    //set up renderer
	    this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	    this.renderer.domElement.id = 'three-canvas'
	    this.renderer.setPixelRatio( window.devicePixelRatio );
	    this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
	    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
	    this.renderer.toneMappingExposure = 0.8;
	    this.renderer.outputEncoding = THREE.sRGBEncoding;
	    this.renderer.setClearColor(0xffffff, 0);
	    this.container.appendChild( this.renderer.domElement );

	    // Add floor plane
	    // var geo = new THREE.PlaneBufferGeometry(30, 30, 8, 8);
	    // var texture = THREE.ImageUtils.loadTexture('assets/images/grid.jpg');
	    // var mat = new THREE.MeshBasicMaterial({map: texture});
	    // var floorPlane = new THREE.Mesh(geo, mat);
	    // floorPlane.rotateX( - Math.PI / 2);

	    // this.scene.add(floorPlane);
	    
	    var pmremGenerator = new THREE.PMREMGenerator( this.renderer );
	    pmremGenerator.compileEquirectangularShader();

	    this.render()
	}


	fixCameraOnResize() {
		var aspect = this.container.clientWidth / this.container.clientHeight;
	    this.camera.left = -d * aspect;
	    this.camera.right = d * aspect;
	    this.camera.updateProjectionMatrix();

	    this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );

	    this.render();
	}

	// create a new character at 0,0
	newCharacter(character_id, name, x, y) { 

        this.characters[character_id] = new Character3D(name, x, y, this);

        // if (this.modelScene !== undefined) {
        // 	this.characters[character_id].setModel(this, this.modelScene, this.modelAnimation)
        // }
	}

	// move character with given id to x,y
	moveCharacter(character_id, x, y, callback) {
		let newPos = this.worldVectorForPos(x, y);
		this.characters[character_id].moveTo(newPos, callback);
	}

	// delete character (remove from map and scene) 
	deleteCharacter(character_id) {
		this.characters[character_id].safe_delete(this)
		delete this.characters[character_id];
	}

	deleteAllCharacters() {
		for (let key of Object.keys(this.characters)) {
			this.deleteCharacter(key);
		}
	}
	
	worldVectorForPos(x, y) {
		this.mouse.x = x * 2 - 1;
		this.mouse.y = -1 * (y * 2 - 1);

		return this.groundCollisionVector(this.raycaster);
	}

	// uses raycaster to get collision of current pos of mouse w/ ground
	groundCollisionVector (raycaster) {
	    this.raycaster.setFromCamera( this.mouse, this.camera );
	    var collisionPlane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 0 );
	    var intersectVector = new THREE.Vector3();
	    this.raycaster.ray.intersectPlane(collisionPlane, intersectVector); // copies intersection of ray & plane into vector thats passed in

	    return intersectVector;
	}


	render() {
	    requestAnimationFrame(this.render.bind(this));
	    var deltaTime = this.clock.getDelta();
	    if (this.render != undefined) {
	    	this.renderer.render( this.scene, this.camera ); 
	    }

	    
        for (let key of Object.keys(this.characters)) {
			this.characters[key].update(deltaTime);
		}
	}
}

class Character3D {
	constructor(name, init_x, init_y, parent) {
		this.name = name;
		this.init_x = init_x;
		this.init_y = init_y;


		//load glb file
	    parent.loader.load( 'Fox.glb', ( gltf ) => {
	        gltf.scene.scale.set( 0.04, 0.04, 0.04 );	
	   		this.setModel(parent, gltf.scene, gltf.animations[1], init_x, init_y);
	    }, undefined, function(e) {
	        console.log(e);
	    });

	}

	update(deltaTime) {
		if (this.model !== undefined) {
			this.model.update(deltaTime);
		}
	}

	//returns time it'll take
	moveTo(vector, callback) {
		this.model.setAnimation(vector, callback);
	}

	safe_delete(parent) {
		this.model.walkCycle.enabled = false;
		parent.scene.remove(this.model.modelGeometry);
	}


	setModel(parentScene, model, animation, init_x, init_y) {
		let mixer = new THREE.AnimationMixer( model );
        let walkCycle = mixer.clipAction( animation );
        walkCycle.enabled = false;
        walkCycle.play();

        parentScene.scene.add( model );

        this.model = new AnimatedModel(model, mixer, walkCycle, parentScene.worldVectorForPos(init_x, init_y));  
	}
}

export { Scene3D }
