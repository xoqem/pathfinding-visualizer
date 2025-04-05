import { PointData } from "pixi.js";
import { Graph } from "./graph";

export interface Path {
  end: PointData;
  graph: Graph;
  points: PointData[];
  start: PointData;
}
