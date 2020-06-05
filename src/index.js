import * as THREE from 'three';
import { Character } from './js/character'
import { AnimatedModel } from './js/AnimatedModel'
import { LinearAnimation } from './js/Animations'

import './styles/index.scss'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

var container, controls;
var camera, clock, mixer, scene, renderer;
var raycaster, mouse; // deals with the ray casting (used to translate screen coordiantes to space coordiantes)
var model; // the loaded model

const d = 20; // this controls scale of camera

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );


    // Isometric Camera
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
    
    camera.position.set( 20, 20, 20 ); // these need to all be equal?
    camera.lookAt(0, 0, 0 );

    // set up for ray casting
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    clock = new THREE.Clock();

    scene = new THREE.Scene();

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add(light);

    var loader = new GLTFLoader().setPath( 'assets/models/' );

    loader.load( 'Fox.glb', function ( gltf ) {
        mixer = new THREE.AnimationMixer( gltf.scene );
        var walkCycle = mixer.clipAction(gltf.animations[1])
        walkCycle.enabled = false
        walkCycle.play();

        gltf.scene.scale.set( 0.05, 0.05, 0.05 )
        scene.add( gltf.scene );

        model = new AnimatedModel(gltf.scene, mixer, walkCycle);

        render();

    }, undefined, function(e) {
        console.log(e)
    });

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0xffffff, 1);
    container.appendChild( renderer.domElement );

    // Add floor plane
    var geo = new THREE.PlaneBufferGeometry(30, 30, 8, 8);
    var texture = THREE.ImageUtils.loadTexture('assets/images/grid.jpg');
    var mat = new THREE.MeshBasicMaterial({map: texture});
    var floorPlane = new THREE.Mesh(geo, mat);
    floorPlane.rotateX( - Math.PI / 2);

    scene.add(floorPlane);
    
    var pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    // controls = new OrbitControls( camera, renderer.domElement );
    // controls.minDistance = 2;
    // controls.maxDistance = 20;
    // controls.target.set( 0, 0, - 0.2 );
    // controls.update();

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    var aspect = window.innerWidth / window.innerHeight;
    camera.left = -d * aspect;
    camera.right = d * aspect;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();
}


function setMousePos(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onMouseMove( event ) {
    if (mouse !== undefined) {
        setMousePos(event);
    }
}


function onMouseClick( event ) {
    if (mouse !== undefined && model !== undefined) {
        setMousePos(event);
        var dest = groundCollisionVector(raycaster);
        model.setAnimation(dest);
    }
}

// uses raycaster to get collision of current pos of mouse w/ ground
function groundCollisionVector (raycaster) {
    raycaster.setFromCamera( mouse, camera );
    var collisionPlane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 0 );
    var intersectVector = new THREE.Vector3();
    raycaster.ray.intersectPlane(collisionPlane, intersectVector); // copies intersection of ray & plane into vector thats passed in

    return intersectVector;
}


function render() {
    requestAnimationFrame(render);
    var deltaTime = clock.getDelta();

    if (model !== undefined) {
        
        renderer.render( scene, camera ); 

        model.update(deltaTime)

    }

}

window.onload = function () {
    init();
    render();

    return;

    var conn;

    var characters = {};

    // When clicking on the page, send a move message to the server
    document.addEventListener('click', function (e) {
        if (!conn) {
            return false;
        }

        let x = e.pageX / window.innerWidth;
        let y = e.pageY / window.innerHeight;

        conn.send(JSON.stringify({
            x: x,
            y: y,
            type: 'move'
        }));
    });

    return;

    if (window['WebSocket']) {
        let name = prompt('What\'s your name?');

        conn = new WebSocket('ws://' + 'localhost:8080' + '/ws');
        conn.onopen = function (evt) {
            // Connected to remote
        };
        conn.onclose = function (evt) {
            // Disconnected from remote
        };
        conn.onmessage = function (evt) {
            var messages = evt.data.split('\n');

            for (var i = 0; i < messages.length; i++) {
                var data = JSON.parse(messages[i]);

                if (data.type === 'init') {
                    for (let [key, value] of Object.entries(data.characters)) {
                        characters[key] = new Character(value.name, value.x, value.y);
                    }

                    conn.send(JSON.stringify({
                        name: name,
                        type: 'join'
                    }));
                } else if (data.type === 'move') {
                    characters[data.id].move(data.x, data.y);
                } else if (data.type === 'join') {
                    characters[data.id] = new Character(data.name);
                } else if (data.type === 'leave') {
                    characters[data.id].remove();
                    characters.delete(data.id);
                }
            }
        };
    } else {
        var item = document.createElement('div');
        item.innerHTML = '<b>Your browser does not support WebSockets.</b>';
    }
};


// window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'click', onMouseClick, false );

// window.requestAnimationFrame(render);