import FlatQueue from "flatqueue";
import type { PointData, Polygon } from "pixi.js";
import doesLineIntersectPolygons from "./doesLineIntersectPolygons";
import type Graph from "./graph";
import type { Path } from "./path";
import { arePointsEqual } from "./point";

function heuristic(a: PointData, b: PointData): number {
	return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

interface Params {
	animate?: boolean;
	checkEndPointLineOfSight?: boolean;
	endPoint: PointData;
	graph: Graph;
	polygons: Polygon[] | null;
	startPoint: PointData;
}

export default function* getThetaStarPath({
	animate,
	checkEndPointLineOfSight = true,
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

	if (animate) {
		yield path;
	}

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
				if (animate) {
					yield path;
				}
			}

			break;
		}

		const currentParent = cameFrom.get(currentPoint);

		if (
			checkEndPointLineOfSight &&
			currentParent &&
			!doesLineIntersectPolygons(currentParent, endPoint, polygons)
		) {
			const costToEndPoint = heuristic(currentParent, endPoint);

			// if there is line of sight to the end point, use it
			const newCost = (costSoFar.get(currentParent) || 0) + costToEndPoint;
			const parent = currentParent;

			costSoFar.set(endPoint, newCost);
			const priority = newCost;
			priorityQueue.push(endPoint, priority);
			cameFrom.set(endPoint, parent);

			pathGraph.getNode(endPoint).parent = {
				point: parent,
				cost: costToEndPoint,
			};

			if (animate) {
				yield path;
			}

			continue;
		}

		for (const neighbor of pathGraph.getNode(currentPoint).neighbors) {
			let newCost: number;
			let parent: PointData;
			let costToParent = neighbor.cost;

			if (
				currentParent &&
				// this is the line of sight check
				!doesLineIntersectPolygons(currentParent, neighbor.point, polygons)
			) {
				// if there is line of sight to the parent, use it
				newCost =
					(costSoFar.get(currentParent) || 0) +
					heuristic(currentParent, neighbor.point);
				parent = currentParent;
				costToParent = heuristic(currentParent, neighbor.point);
			} else {
				// otherwise just use the current point
				newCost = (costSoFar.get(currentPoint) || 0) + neighbor.cost;
				parent = currentPoint;
			}

			if (
				!costSoFar.has(neighbor.point) ||
				newCost < (costSoFar.get(neighbor.point) || 0)
			) {
				costSoFar.set(neighbor.point, newCost);
				const priority = newCost + heuristic(endPoint, neighbor.point);
				priorityQueue.push(neighbor.point, priority);
				cameFrom.set(neighbor.point, parent);

				pathGraph.getNode(neighbor.point).parent = {
					point: parent,
					cost: costToParent,
				};

				if (animate) {
					yield path;
				}
			}
		}
	}

	yield path;
}
