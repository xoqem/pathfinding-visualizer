import type { PointData, Polygon } from "pixi.js";
import type Graph from "./graph";
import type { GraphNode } from "./graph";
import type { Path } from "./path";

function heuristic(a: PointData, b: PointData): number {
	return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

interface Params {
	endPoint: PointData;
	graph: Graph;
	polygons: Polygon[] | null;
	startPoint: PointData;
}

export default function* getAStarPath({
	endPoint,
	graph,
	polygons,
	startPoint,
}: Params): Generator<Path> {
	const pathGraph = graph.clone();

	pathGraph.connectPointToGraph({
		maxNeighbors: 8,
		point: startPoint,
		polygons,
	});

	pathGraph.connectPointToGraph({
		maxNeighbors: 8,
		point: endPoint,
		polygons,
	});

	const path: Path = {
		endPoint,
		graph: pathGraph,
		points: [],
		startPoint,
	};

	yield path;

	if (!pathGraph.hasPoint(startPoint) || !pathGraph.hasPoint(endPoint)) {
		return;
	}

	const openSet: Set<PointData> = new Set([startPoint]);
	const gScore: Map<PointData, number> = new Map();
	const fScore: Map<PointData, number> = new Map();

	gScore.set(startPoint, 0);
	fScore.set(startPoint, heuristic(startPoint, endPoint));

	while (openSet.size > 0) {
		let currentPoint: PointData | null = null;
		let lowestFScore = Number.POSITIVE_INFINITY;

		for (const point of openSet) {
			const fScoreValue = fScore.get(point);
			if (fScoreValue && fScoreValue < lowestFScore) {
				lowestFScore = fScoreValue;
				currentPoint = point;
			}
		}

		if (currentPoint === endPoint) {
			let node: GraphNode | null = pathGraph.getNode(endPoint);
			const points = [];
			while (node?.parent) {
				points.push(node.point);
				node = pathGraph.getNode(node.parent.point);
			}

			points.reverse();

			for (const point of points) {
				path.points.push(point);
				yield path;
			}

			// we're done, so break out of the main while loop
			break;
		}

		if (!currentPoint) {
			throw new Error("Unexpected falsy currentPoint value");
		}

		openSet.delete(currentPoint);

		const currentNode = pathGraph.getNode(currentPoint);
		for (const neighbor of currentNode.neighbors) {
			const tentativeGScore = (gScore.get(currentPoint) || 0) + neighbor.cost;

			if (
				tentativeGScore <
				(gScore.get(neighbor.point) || Number.POSITIVE_INFINITY)
			) {
				gScore.set(neighbor.point, tentativeGScore);
				fScore.set(
					neighbor.point,
					tentativeGScore + heuristic(neighbor.point, endPoint),
				);

				if (!openSet.has(neighbor.point)) {
					openSet.add(neighbor.point);
				}

				if (neighbor.point !== startPoint) {
					pathGraph.getNode(neighbor.point).parent = {
						point: currentNode.point,
						cost: neighbor.cost,
					};
					yield path;
				}
			}
		}
	}
}
