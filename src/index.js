import * as THREE from 'three';
import { Character } from './js/character'
import './styles/index.scss'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

var container, controls;
var camera, scene, renderer;

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
    camera.position.set( - 1.8, 0.6, 2.7 );

    scene = new THREE.Scene();

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add(light);

    var loader = new GLTFLoader().setPath( 'assets/models/' );
        loader.load( 'bread.glb', function ( gltf ) {

            console.log(gltf.animations)
            scene.add( gltf.scene );

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

    var pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controls.target.set( 0, 0, - 0.2 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();
}

function render() {
    renderer.render( scene, camera );
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
