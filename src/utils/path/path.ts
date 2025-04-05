import type { PointData } from "pixi.js";
import { getDistance } from "../geometry/point";
import type Graph from "../graph/graph";

export interface Path {
	endPoint: PointData;
	graph: Graph;
	points: PointData[];
	startPoint: PointData;
}

export function getPathDistance(points: PointData[] | null): number {
	if (!points) return 0;

	let distance = 0;

	for (let i = 0; i < points.length - 1; i++) {
		const pointA = points[i];
		const pointB = points[i + 1];

		distance += getDistance(pointA, pointB);
	}

	return distance;
}
