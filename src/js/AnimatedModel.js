import * as THREE from 'three';
import { LinearAnimation } from './Animations'

class AnimatedModel {
	constructor(modelGeometry, mixer, walkCycle, start) {
		this.modelGeometry = modelGeometry;
		this.Animation = new LinearAnimation();
		this.mixer = mixer;
		this.walkCycle = walkCycle

		modelGeometry.position.set(start.x, start.y, start.z)

		this.callback = null
	}

	setAnimation(dest, callback) {
		if (this.Animation.destination && this.Animation.destination.equals(dest)) { return; }
		this.Animation.init(this.modelGeometry.position, dest);

		// update roation (by finding vector we're traveling along, setting angle to that)
        var bearing = dest.clone();
       	bearing.addScaledVector(this.modelGeometry.position, -1);

        // angle between the cur direction and the z axis
        var angle = bearing.angleTo(new THREE.Vector3( 0, 0, 1 ));

        // determine sign of angle (note that this changes the bearing vector)
        bearing.cross(new THREE.Vector3( 0, 0, 1 ))
        var dirCross = -bearing.y;
        angle *= dirCross / Math.abs(dirCross);
       
        //rotate around Y axis
        this.modelGeometry.setRotationFromAxisAngle(new THREE.Vector3( 0, 1, 0 ), angle)
        this.walkCycle.enabled = true

        this.callback = callback
	}

	update(timeDelta) {
		// position animation 
		var pos = this.Animation.update(timeDelta, this.modelGeometry.position);

		//internal animation (e.g. walking)
		this.mixer.update(timeDelta);

		if (this.Animation.finished()) {
			this.walkCycle.enabled = false 

			if (this.callback !== null) {
				this.callback()
				this.callback = null
			}
		}
	}
}


export {
	AnimatedModel
};