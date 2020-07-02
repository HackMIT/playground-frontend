import * as THREE from 'three';
import { LinearAnimation } from './Animations'

class AnimatedModel {
	constructor(modelGeometry, mixer, walkCycle, x, y) {
		this.modelGeometry = modelGeometry;
		this.Animation = new LinearAnimation();
		this.mixer = mixer;
		this.walkCycle = walkCycle

		this.modelGeometry.position.set(x, y, 0)
	}

	setAnimation(dest) {
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
        this.walkCycle.clampWhenFinished = false
        this.walkCycle.enabled = true
	}

	update(timeDelta) {
		// position animation 
		var pos = this.Animation.update(timeDelta, this.modelGeometry.position);

		//internal animation (e.g. walking)
		this.mixer.update(timeDelta);

		if (this.Animation.finished()) {
			this.walkCycle.enabled = false 
		}
	}
}


export {
	AnimatedModel
};