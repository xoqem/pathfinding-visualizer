import type { PointData } from "pixi.js";
import type Graph from "./graph";
import { getDistance } from "./point";

export interface Path {
	endPoint: PointData;
	graph: Graph;
	points: PointData[];
	startPoint: PointData;
}

export function getPathDistance(points: PointData[]): number {
	let distance = 0;

	for (let i = 0; i < points.length - 1; i++) {
		const pointA = points[i];
		const pointB = points[i + 1];

		distance += getDistance(pointA, pointB);
	}

	return distance;
}
