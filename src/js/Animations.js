// class for animating between two THREE.Vector3s
class LinearAnimation {
  static SPEED = 15; // this is units of dist in 3D space / time from clock.getDelta()

  // origin + destination are Vector3s, begFrame is time at begining of animation
  constructor() {
    this.origin = null;
    this.destination = null;
    this.elapsedTime = 0;
    this.dist = null;
  }

  // initializes a new animation at the curFrame, updates variables accordingly
  // returns time it'll take
  init(origin, destination) {
    this.origin = origin.clone();
    this.destination = destination.clone();
    this.elapsedTime = 0;

    this.dist = Math.abs(origin.distanceTo(destination));

    return this.dist / LinearAnimation.SPEED;
  }

  // updates posVector passed in
  update(timeDelta, posVector) {
    // check if no active animation (undefined) or past end
    this.elapsedTime += timeDelta;
    if (this.destination !== null) {
      if (this.elapsedTime < this.dist / LinearAnimation.SPEED) {
        posVector.lerpVectors(
          this.origin, this.destination, ((this.elapsedTime) * LinearAnimation.SPEED) / this.dist,
        );
      } else {
        posVector.set(this.destination.x, this.destination.y, this.destination.z);
      }
    }
  }

  finished() {
    return !(this.elapsedTime < this.dist / LinearAnimation.SPEED);
  }
}

export default LinearAnimation;
