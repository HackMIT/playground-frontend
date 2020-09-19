import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import socket from '../socket';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

import '../../styles/characterSelector.scss';

class CharacterSelector {
  constructor() {
    this.activeTab = 'skin';

    // pink: FF69B4
    this.options = {
      eyes: ['#634e34', '#2e536f', '#3d671d', '#1c7847', '#497665', '#ff0000', '#CD5266', '#DB7E35', '#8ABE3F', '#389BAE', '#4F5AAE', '#FFFFFF', '#603101', '#5e481e', '#63390f'],
      skin: ['#8d5524', '#c68642', '#e0ac69', '#f1c27d', '#ffdbac', '#FE4E8E', '#94D869', '#77E1F9', '#A671FE', '#FE0000'],
      shirt: [
        '#ff99c8',
        '#fcf6bd',
        '#d0f4de',
        '#a9def9',
        '#e4c1f9',
        '#f4f1de',
        '#e07a5f',
        '#3d405b',
        '#81b29a',
        '#f2cc8f',
        '#d8e2dc',
        '#ffe5d9',
        '#ffcad4',
        '#f4acb7',
        '#9d8189',
        '#353535',
        '#3c6e71',
        '#ad7a99',
        '#d9d9d9',
        '#284b63',
        '#0a0908',
        '#22333b',
        '#eae0d5',
        '#c6ac8f',
        '#5e503f',
      ],
      pants: [
        '#ff99c8',
        '#fcf6bd',
        '#d0f4de',
        '#a9def9',
        '#e4c1f9',
        '#f4f1de',
        '#e07a5f',
        '#3d405b',
        '#81b29a',
        '#f2cc8f',
        '#d8e2dc',
        '#ffe5d9',
        '#ffcad4',
        '#f4acb7',
        '#9d8189',
        '#7caac6',
        '#84beeb',
        '#425d8c',
        '#1a224a',
        '#313345',
        '#0a0908',
        '#22333b',
        '#eae0d5',
        '#c6ac8f',
        '#5e503f',
      ],
    };

    [this.eyeColor] = this.options.eyes;
    [this.skinColor] = this.options.skin;
    [this.shirtColor] = this.options.shirt;
    [this.pantsColor] = this.options.pants;
  }

  get color() {
    switch (this.activeTab) {
      case 'skin':
        return this.skinColor;
      case 'eyes':
        return this.eyeColor;
      case 'shirt':
        return this.shirtColor;
      case 'pants':
        return this.pantsColor;
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
    } else if (this.activeTab === 'pants') {
      this.pantsColor = newValue;
    }
  }

  cleanup = () => {
    window.cancelAnimationFrame(this.renderId);
  };

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
        Skin: this.getColor(this.pantsColor),
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

  render = () => {
    this.renderId = requestAnimationFrame(this.render);
    const timeDelta = this.clock.getDelta();
    this.renderCalls.forEach((callback) => {
      callback(timeDelta);
    });
  };

  createModal = () => {
    if (this.scene === undefined) {
      const backgroundColor = 0x666666;

      /* //////////////////////////////////////// */

      this.clock = new THREE.Clock();
      this.renderCalls = [];

      /* //////////////////////////////////////// */

      const width = 240;
      const height = 320;

      this.scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 800);
      camera.position.set(0, 2.15, 2.5);
      camera.rotation.x = -0.2;

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(width, height);
      this.renderer.setClearColor(backgroundColor);

      // renderer.toneMapping = THREE.ACESFilmicToneMapping;
      // renderer.toneMappingExposure = 0.8;
      // renderer.outputEncoding = THREE.sRGBEncoding;

      const renderScene = () => {
        this.renderer.render(this.scene, camera);
      };

      this.renderCalls.push(renderScene);

      /* ////////////////////////////////////////////////////////////////////////// */

      const light = new THREE.HemisphereLight(0xffffbb, 0x141434, 1.5);
      this.scene.add(light);

      /* ////////////////////////////////////////////////////////////////////////// */

      this.setCharacter();
    }

    this.render();

    const tabElements = ['Skin', 'Eyes', 'Shirt', 'Pants'].map((tabName) => {
      return (
        <div className="tab" onclick={() => this.setActiveTab(tabName)}>
          {tabName}
        </div>
      );
    });

    tabElements[0].classList.add('selected');
    this.activeTab = 'skin';

    return (
      <div id="character-selector">
        <div id="character-selector-tabs">{tabElements}</div>
        <div id="character-selector-content">
          <div id="character-selector-canvas-container">
            {this.renderer.domElement}
          </div>
          <div id="character-selector-pane">{this.createPaneContent()}</div>
        </div>
        <button
          onclick={() => {
            socket.send({
              type: 'wardrobe_change',
              eyeColor: this.eyeColor,
              skinColor: this.skinColor,
              shirtColor: this.shirtColor,
              pantsColor: this.pantsColor,
            });

            this.cleanup();
            document.getElementById('modal-background').remove();
          }}
        >
          Submit
        </button>
      </div>
    );
  };
}

const characterSelectorInstance = new CharacterSelector();
export default characterSelectorInstance;
