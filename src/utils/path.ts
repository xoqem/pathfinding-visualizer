import type { PointData } from "pixi.js";
import type Graph from "./graph";

export interface Path {
	endPoint: PointData;
	graph: Graph;
	points: PointData[];
	startPoint: PointData;
}
