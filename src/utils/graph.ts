import { PointData } from "pixi.js";
import { arePointsEqual, getDistance } from "./point";

export interface Neighbor {
  point: PointData;
  cost: number;
}

export interface Graph {
  [key: string]: {
    point: PointData;
    neighbors: Neighbor[];
  };
}

export function getGraphKey(point: PointData) {
  return `${point.x},${point.y}`;
}

export function initializeGraphEntry(graph: Graph, point: PointData) {
  const key = getGraphKey(point);
  if (graph[key]) return null;

  graph[key] = {
    point,
    neighbors: [],
  };
}

export function getGraphValue(graph: Graph, point: PointData) {
  const key = getGraphKey(point);
  if (!graph[key]) {
    initializeGraphEntry(graph, point);
  }

  return graph[getGraphKey(point)];
}

export function isPointInNeighbors(point: PointData, neighbors: Neighbor[]) {
  return neighbors.some((neighbor) => arePointsEqual(neighbor.point, point));
}

export function addNeighbor(graph: Graph, point: PointData, neighborPoint: PointData) {
  const { neighbors } = getGraphValue(graph, point);
  if (isPointInNeighbors(neighborPoint, neighbors)) return;

  const cost = getDistance(point, neighborPoint);
  neighbors.push({ point: neighborPoint, cost });

  const { neighbors: neighborNeighbors } = getGraphValue(graph, neighborPoint);
  neighborNeighbors.push({ point, cost });
}
