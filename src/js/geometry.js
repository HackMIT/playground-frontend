// this file is a collection of geometry methods used for determining interestions with walls

// check whether a point is inside polygon (a list of points)
// uses crossing number algorithm
function pointInPolygon(point, polygon) {
	let numIntersections = 0;

	for (let i = 0; i < polygon.length; i++) {
		let polyPointA = polygon[i];
		let polyPointB = polygon[(i + 1) % polygon.length];

		if (horizRayInterectsLine(point, polyPointA, polyPointB)) {
			numIntersections++;
		}

	}

	return numIntersections % 2 === 1;
}

// whether a horizontal ray from point extending in positive x direction 
// intersects line defined by lineA and lineB
function horizRayInterectsLine(point, lineA, lineB) {
	if ((lineA[1] - point[1]) * (lineB[1] - point[1]) > 0) {
		return false; //both points are either above or below ray
	}

	let invSlope = (lineB[0] - lineA[0]) / (lineB[1] - lineA[1]);
	let intersectionX = (point[1] - lineA[1]) * invSlope + lineA[0];

	return intersectionX > point[0];
}

// whether line segment intersects any side of polygon
function lineIntersectsPolygon(line, polygon) {
	for (let i = 0; i < polygon.length; i++) {
		let polyPointA = polygon[i];
		let polyPointB = polygon[(i + 1) % polygon.length];

		if (linesIntersect(line, [polyPointA, polyPointB])) {
			return true;
		}
	}

	return false;
}

// checks wheter the two lines segments interesect, where both are list of two points
function linesIntersect(line1, line2) {

	let o1 = orientation(line1[0], line1[1], line2[0]);
    let o2 = orientation(line1[0], line1[1], line2[1]); 
    let o3 = orientation(line2[0], line2[1], line1[0]);
    let o4 = orientation(line2[0], line2[1], line1[1]);


    let onSegment = (p1, p2, p3) => {
    	let xs = (p2[0] <= Math.max(p1[0], p3[0])) && (p2[0] >= Math.min(p1[0], p3[0]));
    	let ys = (p2[1] <= Math.max(p1[1], p3[1])) && (p2[1] >= Math.min(p1[1], p3[1]));
    	return xs && ys;
	};

    if ((o1 != o2) && (o3 != o4)) { return true; } 
  	
  	//colinear cases
    if ((o1 == 0) && onSegment(line1[0], line2[0], line1[1])) { return true; }
    if ((o2 == 0) && onSegment(line1[0], line2[1], line1[1])) { return true; }
    if ((o3 == 0) && onSegment(line2[0], line1[0], line2[1])) { return true; }
    if ((o4 == 0) && onSegment(line2[0], line1[1], line2[1])) { return true; }
    
    return false;
}	



// whether 3 points are clockwise, counterclockwise, or colinear
function orientation(p1, p2, p3) {
	let val = ((p2[1] - p1[1]) * (p3[0] - p2[0])) - ((p2[0] - p1[0]) * (p3[1] - p2[1]))
    if ( val > 0 ) { return 1; } 
    if ( val < 0 ) { return -1; }
    return 0;
}

export { pointInPolygon, lineIntersectsPolygon };