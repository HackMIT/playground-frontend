import * as THREE from 'three';

import { AnimatedModel } from './AnimatedModel'

class Character3D {
	constructor(name, init_x, init_y, parent, reverseRaycaster) {
		this.name = name;
		this.init_x = init_x;
		this.init_y = init_y;
		this.reverseRaycaster = reverseRaycaster

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
		let time = this.model.setAnimation(vector, callback);	
	}

	safe_delete(parent) {
		this.model.deconstruct();
		parent.scene.remove(this.model.modelGeometry);
	}


	setModel(parentScene, model, animation, init_x, init_y) {
		let mixer = new THREE.AnimationMixer( model );
        let walkCycle = mixer.clipAction( animation );
        walkCycle.enabled = false;
        walkCycle.play();

        parentScene.scene.add( model );

        this.model = new AnimatedModel(model, mixer, walkCycle, parentScene.worldVectorForPos(init_x, init_y), this.name, this.reverseRaycaster);  
	}

	//say msg, return name
	sendChat(msg) {
		if (this.model !== undefined) {
			this.model.updateChat(msg);
		}

		return this.name;
	}
}

export { Character3D }