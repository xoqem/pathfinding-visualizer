import type { PointData, Polygon } from "pixi.js";
import doesLineIntersectPolygons from "./doesLineIntersectPolygons";
import { arePointsEqual, getDistance } from "./point";

export interface Neighbor {
	point: PointData;
	cost: number;
}

export function sortNeighborsByCost(neighbors: Neighbor[]) {
	return neighbors.sort(({ cost: costA }, { cost: costB }) => costA - costB);
}

export function isPointInNeighbors(point: PointData, neighbors: Neighbor[]) {
	return neighbors.some((neighbor) => arePointsEqual(neighbor.point, point));
}

export function getPointKey(point: PointData) {
	return `${point.x},${point.y}`;
}

export interface GraphNode {
	point: PointData;
	neighbors: Neighbor[];
	parent?: Neighbor;
}

export default class Graph {
	constructor() {
		this.nodesMap = new Map();
		this.points = [];
		this.nodes = [];
	}

	private nodesMap: Map<string, GraphNode>;
	points: PointData[];
	nodes: GraphNode[];

	initializeGraphEntry(point: PointData) {
		const key = getPointKey(point);
		if (this.nodesMap.get(key)) return null;

		const node = {
			point,
			neighbors: [],
		};

		this.nodesMap.set(key, node);

		this.points.push(point);
		this.nodes.push(node);
	}

	hasPoint(point: PointData) {
		const key = getPointKey(point);
		return this.nodesMap.has(key);
	}

	getNode(point: PointData) {
		const key = getPointKey(point);
		if (!this.nodesMap.has(key)) {
			this.initializeGraphEntry(point);
		}

		const graphNode = this.nodesMap.get(key);
		if (!graphNode) {
			throw new Error(`Graph node should have existed for point: ${point}`);
		}

		return graphNode;
	}

	addNeighbor({ point, neighbor }: { point: PointData; neighbor: Neighbor }) {
		const graphNode = this.getNode(point);
		if (isPointInNeighbors(neighbor.point, graphNode.neighbors)) return;

		graphNode.neighbors.push({ point: neighbor.point, cost: neighbor.cost });

		const neighborGraphValue = this.getNode(neighbor.point);
		neighborGraphValue.neighbors.push({ point, cost: neighbor.cost });
	}

	connectPointToGraph({
		maxNeighborDistance,
		maxNeighbors,
		polygons,
		point,
	}: {
		maxNeighborDistance?: number;
		maxNeighbors: number;
		point: PointData;
		polygons: Polygon[] | null;
	}) {
		const neighbors: Neighbor[] = [];
		for (const neighborPoint of this.points) {
			if (arePointsEqual(point, neighborPoint)) continue;

			const distance = getDistance(point, neighborPoint);
			if (maxNeighborDistance && distance > maxNeighborDistance) continue;

			if (doesLineIntersectPolygons(point, neighborPoint, polygons)) continue;

			neighbors.push({
				cost: distance,
				point: neighborPoint,
			});
		}

		const slicedNeighbors = sortNeighborsByCost(neighbors).slice(
			0,
			maxNeighbors,
		);

		for (const neighbor of slicedNeighbors) {
			this.addNeighbor({ point, neighbor });
		}
	}

	clone() {
		const clonedGraph = new Graph();
		for (const node of this.nodes) {
			clonedGraph.initializeGraphEntry(node.point);
		}

		for (const node of this.nodes) {
			const clonedNode = clonedGraph.getNode(node.point);

			clonedNode.neighbors = node.neighbors.map((neighbor) => ({
				point: clonedGraph.getNode(neighbor.point).point,
				cost: neighbor.cost,
			}));

			if (node.parent) {
				clonedNode.parent = {
					point: clonedGraph.getNode(node.parent.point).point,
					cost: node.parent.cost,
				};
			}
		}

		return clonedGraph;
	}
}
