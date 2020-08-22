import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Character from './character';

const d = 20; // this controls scale of camera

class Scene {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'three-container';
    this.gameElem = document.getElementById('game');
    this.gameElem.appendChild(this.container);

    // Isometric Camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      1,
      1000
    );

    this.camera.position.set(20, 20, 20); // these need to all be equal?
    this.camera.lookAt(0, 0, 0);

    // set up for ray casting
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();

    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    this.scene.add(light);

    this.loader = new GLTFLoader().setPath('assets/models/');

    this.characters = new Map();

    // set up renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.domElement.id = 'three-canvas';
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.8;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.setClearColor(0xffffff, 0);
    this.container.appendChild(this.renderer.domElement);

    // Add floor plane
    // var geo = new THREE.PlaneBufferGeometry(30, 30, 8, 8);
    // var texture = THREE.ImageUtils.loadTexture('assets/images/grid.jpg');
    // var mat = new THREE.MeshBasicMaterial({map: texture});
    // var floorPlane = new THREE.Mesh(geo, mat);
    // floorPlane.rotateX( - Math.PI / 2);

    // this.scene.add(floorPlane);

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    this.render();
  }

  fixCameraOnResize() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.left = -d * aspect;
    this.camera.right = d * aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.render();
  }

  // create a new character at 0,0
  newCharacter(characterId, name, x, y) {
    this.characters[characterId] = new Character(name, x, y, this, (vec) => {
      vec.project(this.camera);

      const pageX = Math.round(
        (0.5 + vec.x / 2) *
        (this.renderer.domElement.width / window.devicePixelRatio)
      );
      const pageY = Math.round(
        (0.5 - vec.y / 2) *
        (this.renderer.domElement.height / window.devicePixelRatio)
      );

      return [pageX, pageY];
    });

    // if (this.modelScene !== undefined) {
    //   this.characters[character_id].setModel(this, this.modelScene, this.modelAnimation)
    // }
  }

  // move character with given id to x,y
  moveCharacter(id, x, y, callback) {
    const newPos = this.worldVectorForPos(x, y);
    this.characters[id].moveTo(newPos, callback);
  }

  // delete character (remove from map and scene)
  deleteCharacter(id) {
    this.characters[id].safeDelete(this);
    delete this.characters[id];
  }

  deleteAllCharacters() {
    Object.keys(this.characters).forEach((id) => {
      this.deleteCharacter(id);
    });
  }

  // character with given id sends msg, returns its name
  sendChat(characterId, msg) {
    return this.characters[characterId].sendChat(msg);
  }

  worldVectorForPos(x, y) {
    this.mouse.x = x * 2 - 1;
    this.mouse.y = -1 * (y * 2 - 1);

    return this.groundCollisionVector(this.raycaster);
  }

  // uses raycaster to get collision of current pos of mouse w/ ground
  groundCollisionVector() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const collisionPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectVector = new THREE.Vector3();

    // copies intersection of ray & plane into vector thats passed in
    this.raycaster.ray.intersectPlane(collisionPlane, intersectVector);

    return intersectVector;
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    const deltaTime = this.clock.getDelta();
    if (this.render !== undefined) {
      this.renderer.render(this.scene, this.camera);
    }

    Object.keys(this.characters).forEach((id) => {
      this.characters[id].update(deltaTime);
    });
  }
}

export default Scene;
