import type { PointData } from "pixi.js";
import type { Graph } from "./graph";

export interface Path {
	end: PointData;
	graph: Graph;
	points: PointData[];
	start: PointData;
}
