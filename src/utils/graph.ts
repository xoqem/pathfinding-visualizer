import type { PointData, Polygon } from "pixi.js";
import doesLineIntersectPolygons from "./doesLineIntersectPolygons";
import { arePointsEqual, getDistance } from "./point";

export interface Neighbor {
	point: PointData;
	cost: number;
}

export interface GraphNode {
	point: PointData;
	neighbors: Neighbor[];
	parent?: Neighbor;
}

export interface Graph {
	[key: string]: GraphNode;
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

export function sortNeighborsByCost(neighbors: Neighbor[]) {
	return neighbors.sort(({ cost: costA }, { cost: costB }) => costA - costB);
}

interface AddNeighborParams {
	graph: Graph;
	point: PointData;
	neighbor: Neighbor;
}

export function addNeighbor({ graph, point, neighbor }: AddNeighborParams) {
	const graphValue = getGraphValue(graph, point);
	if (isPointInNeighbors(neighbor.point, graphValue.neighbors)) return;

	graphValue.neighbors.push({ point: neighbor.point, cost: neighbor.cost });

	const neighborGraphValue = getGraphValue(graph, neighbor.point);
	neighborGraphValue.neighbors.push({ point, cost: neighbor.cost });
}

interface ConnectPointToGraphParams {
	graph: Graph;
	maxNeighborDistance?: number;
	maxNeighbors: number;
	point: PointData;
	polygons: Polygon[] | null;
}

export function connectPointToGraph({
	graph,
	maxNeighborDistance,
	maxNeighbors,
	polygons,
	point,
}: ConnectPointToGraphParams) {
	const graphNodes = Object.values(graph);

	const neighbors: Neighbor[] = [];
	for (const { point: neighborPoint } of graphNodes) {
		if (arePointsEqual(point, neighborPoint)) continue;

		const distance = getDistance(point, neighborPoint);
		if (maxNeighborDistance && distance > maxNeighborDistance) continue;

		if (doesLineIntersectPolygons(point, neighborPoint, polygons)) continue;

		neighbors.push({
			cost: distance,
			point: neighborPoint,
		});
	}

	const slicedNeighbors = sortNeighborsByCost(neighbors).slice(0, maxNeighbors);

	for (const neighbor of slicedNeighbors) {
		addNeighbor({ graph, point, neighbor });
	}
}
