import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

import '../../styles/characterSelector.scss';

class CharacterSelector {
  constructor() {
    this.activeTab = 'skin';

    this.options = {
      eyes: ['#634e34', '#2e536f', '#3d671d', '#1c7847', '#497665', '#ff0000'],
      skin: ['#8d5524', '#c68642', '#e0ac69', '#f1c27d', '#ffdbac'],
      shirt: ['#d6e2f9', '#75c05c', '#e4c3a4', '#f7f1d3', '#b93434'],
    };

    [this.eyeColor] = this.options.eyes;
    [this.skinColor] = this.options.skin;
    [this.shirtColor] = this.options.shirt;
  }

  get color() {
    switch (this.activeTab) {
      case 'skin':
        return this.skinColor;
      case 'eyes':
        return this.eyeColor;
      case 'shirt':
        return this.shirtColor;
      default:
        break;
    }

    return null;
  }

  get colorOptions() {
    return this.options[this.activeTab.toLowerCase()];
  }

  set color(newValue) {
    if (this.activeTab === 'skin') {
      this.skinColor = newValue;
    } else if (this.activeTab === 'eyes') {
      this.eyeColor = newValue;
    } else if (this.activeTab === 'shirt') {
      this.shirtColor = newValue;
    }
  }

  updatePaneContent = () => {
    const paneElem = document.getElementById('character-selector-pane');
    paneElem.innerHTML = '';
    paneElem.appendChild(this.createPaneContent());
  };

  createPaneContent = () => {
    const elements = this.colorOptions.map((color) => {
      return (
        <div
          className={`box ${this.color === color ? 'selected' : ''}`}
          onclick={() => {
            this.color = color;
            this.setCharacter();
            this.updatePaneContent();
          }}
          style={`background: ${color}; border-color: ${color}`}
        />
      );
    });

    return <div>{elements}</div>;
  };

  getColor = (hex) => {
    return hex
      .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`
      )
      .substring(1)
      .match(/.{2}/g)
      .map((x) => parseInt(x, 16) / 255);
  };

  setCharacter = () => {
    if (this.characterObject !== undefined) {
      this.scene.remove(this.characterObject);
      this.renderCalls.pop();
    }

    const loader = new GLTFLoader();
    loader.crossOrigin = true;
    const req = new XMLHttpRequest();
    req.open('GET', 'models/character.gltf', true);
    req.onload = () => {
      const gltfData = JSON.parse(req.response);

      const matColors = {
        Head: this.getColor(this.skinColor),
        Face: this.getColor(this.eyeColor),
        Shirt: this.getColor(this.shirtColor),
      };

      gltfData.materials = gltfData.materials.map((mat) => {
        if (Object.keys(matColors).includes(mat.name)) {
          mat.pbrMetallicRoughness.baseColorFactor = matColors[mat.name].concat(
            // add 1 to array for alpha channel
            1
          );
        }

        return mat;
      });

      loader.parse(
        JSON.stringify(gltfData),
        'models/',
        (gltf) => {
          this.characterObject = gltf.scene;
          this.characterObject.position.set(0, 0, 0);
          this.scene.add(this.characterObject);

          const mixer = new THREE.AnimationMixer(this.scene);
          mixer.timeScale = 0.5;

          const cycle = mixer.clipAction(gltf.animations[2]);
          cycle.enabled = true;
          cycle.play();

          this.renderCalls.push((timeDelta) => {
            mixer.update(timeDelta);
          });
        },
        undefined,
        (err) => {
          console.error(err);
        }
      );
    };

    req.send();
  };

  setActiveTab = (tabName) => {
    Array.from(document.getElementsByClassName('tab')).forEach((elem) => {
      elem.classList.remove('selected');

      if (tabName.toLowerCase() === elem.innerText.toLowerCase()) {
        elem.classList.add('selected');
      }
    });

    this.activeTab = tabName.toLowerCase();
    this.updatePaneContent();
  };

  createModal = () => {
    const backgroundColor = 0x666666;

    /* //////////////////////////////////////// */

    const clock = new THREE.Clock();

    this.renderCalls = [];
    const render = () => {
      requestAnimationFrame(render);
      const timeDelta = clock.getDelta();
      this.renderCalls.forEach((callback) => {
        callback(timeDelta);
      });
    };
    render();

    /* //////////////////////////////////////// */

    const width = 240;
    const height = 320;

    this.scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 800);
    camera.position.set(0, 2.15, 2.5);
    camera.rotation.x = -0.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(backgroundColor);

    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 0.8;
    // renderer.outputEncoding = THREE.sRGBEncoding;

    const renderScene = () => {
      renderer.render(this.scene, camera);
    };

    this.renderCalls.push(renderScene);

    /* ////////////////////////////////////////////////////////////////////////// */

    const light = new THREE.HemisphereLight(0xffffbb, 0x141434, 1.5);
    this.scene.add(light);

    /* ////////////////////////////////////////////////////////////////////////// */

    this.setCharacter();

    const tabElements = ['Skin', 'Eyes', 'Shirt', 'Pants'].map((tabName) => {
      return (
        <div className="tab" onclick={() => this.setActiveTab(tabName)}>
          {tabName}
        </div>
      );
    });

    tabElements[0].classList.add('selected');

    return (
      <div id="character-selector">
        <div id="character-selector-tabs">{tabElements}</div>
        <div id="character-selector-content">
          <div id="character-selector-canvas-container">
            {renderer.domElement}
          </div>
          <div id="character-selector-pane">{this.createPaneContent()}</div>
        </div>
      </div>
    );
  };
}

const characterSelectorInstance = new CharacterSelector();
export default characterSelectorInstance;
