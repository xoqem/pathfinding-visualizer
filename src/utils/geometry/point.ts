import type { PointData } from "pixi.js";

export function arePointsEqual(pointA: PointData, pointB: PointData) {
	return pointA.x === pointB.x && pointA.y === pointB.y;
}

export function getDistance(a: PointData, b: PointData) {
	return Math.hypot(a.x - b.x, a.y - b.y);
}
