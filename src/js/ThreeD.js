import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { AnimatedModel } from './AnimatedModel'
import { LinearAnimation } from './Animations'

const d = 20; // this controls scale of camera

class Scene3D {
	constructor() {
		this.container = document.createElement( 'div' );
	    document.body.appendChild( this.container );

	    // Isometric Camera
	    var aspect = window.innerWidth / window.innerHeight;
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

	    var loader = new GLTFLoader().setPath( '/images/' );

	    //load glb file
	    loader.load( 'Fox.glb', ( gltf ) => {
	        gltf.scene.scale.set( 0.05, 0.05, 0.05 )	
	   		this.modelScene = gltf.scene // use this to create characters...
	   		this.modelAnimation = gltf.animations[1] // this is walk cycle for characters

	   		//set model of all already created characters
	   		for (let key of Object.keys(this.characters)) {
				this.characters[key].setModel(this.scene, this.modelScene, this.modelAnimation)
			}
	    }, undefined, function(e) {
	        console.log(e)
	    });

	    this.characters = new Map();

	    //set up renderer
	    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	    this.renderer.setPixelRatio( window.devicePixelRatio );
	    this.renderer.setSize( window.innerWidth, window.innerHeight );
	    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
	    this.renderer.toneMappingExposure = 0.8;
	    this.renderer.outputEncoding = THREE.sRGBEncoding;
	    this.renderer.setClearColor(0xffffff, 1);
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
	}


	fixCameraOnResize() {
		var aspect = window.innerWidth / window.innerHeight;
	    this.camera.left = -d * aspect;
	    this.camera.right = d * aspect;
	    this.camera.updateProjectionMatrix();

	    this.renderer.setSize( window.innerWidth, window.innerHeight );

	    this.render();
	}

	// create a new character at 0,0
	newCharacter(character_id, name, x, y) {      
        this.characters[character_id] = new Character3D(name, x, y);

        if (this.modelScene !== undefined) {
        	this.characters[character_id].setModel(this.scene, this.modelScene, this.modelAnimation)
        }

	}

	// move character with given id to x,y
	moveCharacter(character_id, x, y) {
		let newPos = this.worldVectorForPos(x, y);
		this.characters[character_id].moveTo(newPos);
	}

	// delete character (remove from map and scene) 
	deleteCharacter(character_id) {
		this.scene.remove(this.characters[character_id].model.modelGeometry);
		delete this.characters[character_id];
	}

	deleteAllCharacters() {
		for (let key of Object.keys(this.characters)) {
			deleteCharacter(key);
		}
	}
	
	worldVectorForPos(x, y) {
		this.mouse.x = x;
		this.mouse.y = y;

		return this.groundCollisionVector(this.raycaster);
	}

	// uses raycaster to get collision of current pos of mouse w/ ground
	groundCollisionVector (raycaster) {
	    raycaster.setFromCamera( mouse, camera );
	    var collisionPlane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 0 );
	    var intersectVector = new THREE.Vector3();
	    raycaster.ray.intersectPlane(collisionPlane, intersectVector); // copies intersection of ray & plane into vector thats passed in

	    return intersectVector;
	}


	render() {
	    requestAnimationFrame(render);
	    var deltaTime = this.clock.getDelta();

	    if (model !== undefined) {
	        
	        this.renderer.render( scene, camera ); 

	        this.characters.forEach(character => {
	        	character.update(deltaTime)
	        });
	    }
	}
}

class Character3D {
	constructor(name, init_x, init_y) {
		this.name = name;
		this.init_x = init_x;
		this.init_y = init_y;
	}

	update(deltaTime) {
		this.model.update(deltaTime)
	}

	moveTo(vector) {
		this.model.setAnimation(vector)
	}

	setModel(parentScene, model, animation) {
		let mixer = new THREE.AnimationMixer( model );
        let walkCycle = mixer.clipAction( animation );
        walkCycle.enabled = false;
        walkCycle.play();

        parentScene.add( model );

        this.model = new AnimatedModel(this.model, mixer, walkCycle, this.init_x, this.init_y);   
	}
}

export { Scene3D }