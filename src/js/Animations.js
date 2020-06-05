import * as THREE from 'three';

// class for animating between two THREE.Vector3s
class LinearAnimation {
	static SPEED = 15; // this is units of dist in 3D space / time from clock.getDelta()

	// origin + destination are Vector3s, begFrame is time at begining of animation
	constructor() {
		this.origin = null;
		this.destination = null;
		this.elapsedTime = 0;
		this.dist  = null;
	}

	// initializes a new animation at the curFrame, updates variables accordingly
	init(origin, destination) {
		this.origin = origin.clone();
		this.destination = destination.clone();
		this.elapsedTime = 0;

		this.dist = Math.abs(origin.distanceTo(destination));
	}

	// updates posVector passed in
	update(timeDelta, posVector) {
		// check if no active animation (undefined) or past end
		this.elapsedTime += timeDelta;

		if (this.destination !== null && this.elapsedTime < this.dist / LinearAnimation.SPEED) {
			posVector.lerpVectors(this.origin, this.destination, ((this.elapsedTime)*LinearAnimation.SPEED)/this.dist);
		} 
	}


	finished() {
		return  !(this.elapsedTime < this.dist / LinearAnimation.SPEED);
	}
}


export {
    LinearAnimation
};