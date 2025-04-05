import FlatQueue from "flatqueue";
import type { PointData, Polygon } from "pixi.js";
import type Graph from "./graph";
import type { Path } from "./path";
import { arePointsEqual } from "./point";

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

	if (pathGraph.hasPoint(startPoint)) {
		startPoint = pathGraph.getNode(startPoint).point;
	} else {
		pathGraph.connectPointToGraph({
			maxNeighbors: 4,
			point: startPoint,
			polygons,
		});
	}

	if (pathGraph.hasPoint(endPoint)) {
		endPoint = pathGraph.getNode(endPoint).point;
	} else {
		pathGraph.connectPointToGraph({
			maxNeighbors: 4,
			point: endPoint,
			polygons,
		});
	}

	const path: Path = {
		endPoint,
		graph: pathGraph,
		points: [],
		startPoint,
	};

	yield path;

	if (
		arePointsEqual(startPoint, endPoint) ||
		!pathGraph.hasPoint(startPoint) ||
		!pathGraph.hasPoint(endPoint)
	) {
		return;
	}

	const priorityQueue = new FlatQueue<PointData>();
	priorityQueue.push(startPoint, 0);
	const cameFrom = new Map<PointData, PointData | null>();
	const costSoFar = new Map<PointData, number>();
	cameFrom.set(startPoint, null);
	costSoFar.set(startPoint, 0);

	while (priorityQueue.length) {
		const currentPoint = priorityQueue.pop();

		if (!currentPoint) {
			throw new Error("Unexpected falsy currentPoint value");
		}

		if (currentPoint === endPoint) {
			let current: PointData | null = endPoint;
			const points = [];
			while (current) {
				points.push(current);
				current = cameFrom.get(current) || null;
			}

			points.reverse();

			for (const point of points) {
				path.points.push(point);
				yield path;
			}

			// we're done, so break out of the main while loop
			break;
		}

		for (const neighbor of pathGraph.getNode(currentPoint).neighbors) {
			const newCost = (costSoFar.get(currentPoint) || 0) + neighbor.cost;
			if (
				!costSoFar.has(neighbor.point) ||
				newCost < (costSoFar.get(neighbor.point) || 0)
			) {
				costSoFar.set(neighbor.point, newCost);
				const priority = newCost + heuristic(endPoint, neighbor.point);
				priorityQueue.push(neighbor.point, priority);
				cameFrom.set(neighbor.point, currentPoint);

				pathGraph.getNode(neighbor.point).parent = {
					point: currentPoint,
					cost: neighbor.cost,
				};

				yield path;
			}
		}
	}
}
