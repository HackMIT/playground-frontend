import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Character from './character';

const d = 20; // this controls scale of camera

class Scene {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'three-container';
    this.gameElem = document.getElementById('game');
    this.gameElem.insertBefore(this.container, this.gameElem.childNodes[0]);

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

    // const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    const light = new THREE.HemisphereLight(0xffffbb, 0x141434, 1);
    this.scene.add(light);

    this.loader = new GLTFLoader();

    this.characters = new Map();
    this.buildings = new Map();
    this.textures = new Map();

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
  }

  // create a new character at 0,0
  newCharacter(id, character) {
    this.characters[id] = new Character(character, this, (vec) => {
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
  }

  updateClothes(id, data) {
    const characterData = this.characters[id].data;

    Object.keys(data).forEach((key) => {
      characterData[key] = data[key];
    });

    this.characters[id].safeDelete(this);
    delete this.characters[id];

    this.newCharacter(id, characterData);
  }

  // move character with given id to x,y
  moveCharacter(id, x, y, callback) {
    this.characters[id].data.x = x;
    this.characters[id].data.y = y;

    const newPos = this.worldVectorForPos(x, y);
    this.characters[id].moveTo(newPos, callback);
  }

  danceCharacter(id, dance) {
    this.characters[id].dance(dance);
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

  updateMouseForPos(x, y) {
    this.mouse.x = x * 2 - 1;
    this.mouse.y = -1 * (y * 2 - 1);
  }

  worldVectorForPos(x, y) {
    this.updateMouseForPos(x, y);

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

  // show profile if clicked on character
  // called from click handler of main page
  // returns true if a character was clicked on, false otherwise
  handleClickEvent(x, y) {
    this.updateMouseForPos(x, y);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    let success = false;

    Object.values(this.characters).some((character) => {
      const intersects = this.raycaster.intersectObject(
        character.model.modelGeometry,
        true
      );

      if (intersects.length > 0) {
        success = true;
        character.showProfile();
        return true;
      }

      return false;
    });

    let building_success = false
    this.buildings.forEach((elem, building) => {
      const intersects = this.raycaster.intersectObject(building);
      if (intersects.length > 0) {
        if (elem.hasAction()) {
          building_success = true;
          elem.onClick();
        }
      }
    });

    return success || building_success;
  }


  // creates an object on a plane for an object with the given bounding box in [0,1]^2 coords
  create2DObject(boundingBox, imgPath, shiftAmt, element) {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const height = boundingBox.height * 2 * d * Math.sqrt(3/2);
    const width = boundingBox.width * 2 * d * aspect;
    const baseX = boundingBox.x;
    const baseY = boundingBox.y + boundingBox.height * (1/2 - shiftAmt);
    const basePt = this.worldVectorForPos(baseX, baseY);

    let texture = null;
    if (this.textures.has(imgPath)){
      texture = this.textures.get(imgPath);
    } else {
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      texture = loader.load(imgPath);
      texture.encoding = THREE.sRGBEncoding;
      this.textures.set(imgPath, texture);
    }

    var geometry = new THREE.PlaneGeometry( width, height);
    const material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    plane.renderOrder = baseY * this.container.clientHeight;
    plane.position.set(basePt.x, height/2 - height*shiftAmt, basePt.z);
    // plane.scale.set(width, height, 1);
    plane.rotateY( Math.PI / 4);

    this.scene.add(plane);
    this.buildings.set(plane, element);

    return plane;
  }

  changeBuildingImage(building, newImg) {
    let texture = null;
    if (this.textures.has(newImg)){
      texture = this.textures.get(newImg);
      console.log("he's cached")
    } else {
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      texture = loader.load(newImg);
      texture.encoding = THREE.sRGBEncoding;
      this.textures.set(newImg, texture);
    }

    building.material.map = texture;
  }

  removeAllBuildings() {
    this.buildings.forEach((building) => {
      this.scene.remove(building);
    });
  }


  render() {
    requestAnimationFrame(this.render.bind(this));

    const deltaTime = this.clock.getDelta();

    Object.keys(this.characters).forEach((id) => {
      this.characters[id].update(deltaTime);
    });

    if (this.render !== undefined) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

export default Scene;
