import { PointData } from "pixi.js";

export function arePointsEqual(pointA: PointData, pointB: PointData) {
  return pointA.x === pointB.x && pointA.y === pointB.y;
}

export function getDistance(a: PointData, b: PointData) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}