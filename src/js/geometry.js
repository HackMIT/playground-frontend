// this file is a collection of geometry methods used for determining interestions with walls

// whether a horizontal ray from point extending in positive x direction
// intersects line defined by lineA and lineB
function horizRayInterectsLine(point, lineA, lineB) {
  if ((lineA[1] - point[1]) * (lineB[1] - point[1]) > 0) {
    return false; // both points are either above or below ray
  }

  const invSlope = (lineB[0] - lineA[0]) / (lineB[1] - lineA[1]);
  const intersectionX = (point[1] - lineA[1]) * invSlope + lineA[0];

  return intersectionX > point[0];
}

// check whether a point is inside polygon (a list of points)
// uses crossing number algorithm
function pointInPolygon(point, polygon) {
  console.log(point, polygon)
  let numIntersections = 0;

  for (let i = 0; i < polygon.length; i += 1) {
    const polyPointA = polygon[i];
    const polyPointB = polygon[(i + 1) % polygon.length];

    if (horizRayInterectsLine(point, polyPointA, polyPointB)) {
      numIntersections += 1;
    }
  }
  return numIntersections % 2 === 1;
}

// whether 3 points are clockwise, counterclockwise, or colinear
function orientation(p1, p2, p3) {
  const val =
    (p2[1] - p1[1]) * (p3[0] - p2[0]) - (p2[0] - p1[0]) * (p3[1] - p2[1]);
  if (val > 0) {
    return 1;
  }
  if (val < 0) {
    return -1;
  }
  return 0;
}

// checks wheter the two lines segments interesect, where both are list of two points
function linesIntersect(line1, line2) {
  const o1 = orientation(line1[0], line1[1], line2[0]);
  const o2 = orientation(line1[0], line1[1], line2[1]);
  const o3 = orientation(line2[0], line2[1], line1[0]);
  const o4 = orientation(line2[0], line2[1], line1[1]);

  const onSegment = (p1, p2, p3) => {
    const xs =
      p2[0] <= Math.max(p1[0], p3[0]) && p2[0] >= Math.min(p1[0], p3[0]);
    const ys =
      p2[1] <= Math.max(p1[1], p3[1]) && p2[1] >= Math.min(p1[1], p3[1]);
    return xs && ys;
  };

  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  // colinear cases
  if (o1 === 0 && onSegment(line1[0], line2[0], line1[1])) {
    return true;
  }
  if (o2 === 0 && onSegment(line1[0], line2[1], line1[1])) {
    return true;
  }
  if (o3 === 0 && onSegment(line2[0], line1[0], line2[1])) {
    return true;
  }
  if (o4 === 0 && onSegment(line2[0], line1[1], line2[1])) {
    return true;
  }

  return false;
}

// whether line segment intersects any side of polygon
function lineIntersectsPolygon(line, polygon) {
  for (let i = 0; i < polygon.length; i += 1) {
    const polyPointA = polygon[i];
    const polyPointB = polygon[(i + 1) % polygon.length];

    if (linesIntersect(line, [polyPointA, polyPointB])) {
      return true;
    }
  }

  return false;
}

export { pointInPolygon, lineIntersectsPolygon };
