import FlatQueue from "flatqueue";
import type { PointData, Polygon } from "pixi.js";
import { arePointsEqual, getDistance } from "../geometry/point";
import type Graph from "../graph/graph";
import type { Path } from "./path";

function heuristic(a: PointData, b: PointData): number {
	return getDistance(a, b);
}

interface Params {
	animate?: boolean;
	endPoint: PointData;
	graph: Graph;
	polygons: Polygon[] | null;
	startPoint: PointData;
}

export default function* getBidirectionalAStarPath({
	animate,
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

	const forwardQueue = new FlatQueue<PointData>();
	const backwardQueue = new FlatQueue<PointData>();
	forwardQueue.push(startPoint, 0);
	backwardQueue.push(endPoint, 0);

	const forwardCameFrom = new Map<PointData, PointData | null>();
	const backwardCameFrom = new Map<PointData, PointData | null>();
	const forwardCostSoFar = new Map<PointData, number>();
	const backwardCostSoFar = new Map<PointData, number>();

	forwardCameFrom.set(startPoint, null);
	backwardCameFrom.set(endPoint, null);
	forwardCostSoFar.set(startPoint, 0);
	backwardCostSoFar.set(endPoint, 0);

	let meetingPoint: PointData | null = null;

	while (forwardQueue.length && backwardQueue.length) {
		// forward search step
		const currentForward = forwardQueue.pop();
		if (!currentForward) {
			throw new Error("Unexpected falsy currentForward value");
		}

		if (backwardCameFrom.has(currentForward)) {
			meetingPoint = currentForward;
			break;
		}

		for (const neighbor of pathGraph.getNode(currentForward).neighbors) {
			const newCost =
				(forwardCostSoFar.get(currentForward) || 0) + neighbor.cost;
			if (
				!forwardCostSoFar.has(neighbor.point) ||
				newCost < (forwardCostSoFar.get(neighbor.point) || 0)
			) {
				forwardCostSoFar.set(neighbor.point, newCost);
				const priority = newCost + heuristic(endPoint, neighbor.point);
				forwardQueue.push(neighbor.point, priority);
				forwardCameFrom.set(neighbor.point, currentForward);

				pathGraph.getNode(neighbor.point).parent = {
					point: currentForward,
					cost: neighbor.cost,
				};

				if (animate) {
					yield path;
				}
			}
		}

		// backward search step
		const currentBackward = backwardQueue.pop();
		if (!currentBackward) {
			throw new Error("Unexpected falsy currentBackward value");
		}

		if (forwardCameFrom.has(currentBackward)) {
			meetingPoint = currentBackward;
			break;
		}

		for (const neighbor of pathGraph.getNode(currentBackward).neighbors) {
			const newCost =
				(backwardCostSoFar.get(currentBackward) || 0) + neighbor.cost;
			if (
				!backwardCostSoFar.has(neighbor.point) ||
				newCost < (backwardCostSoFar.get(neighbor.point) || 0)
			) {
				backwardCostSoFar.set(neighbor.point, newCost);
				const priority = newCost + heuristic(startPoint, neighbor.point);
				backwardQueue.push(neighbor.point, priority);
				backwardCameFrom.set(neighbor.point, currentBackward);

				pathGraph.getNode(neighbor.point).parent = {
					point: currentBackward,
					cost: neighbor.cost,
				};

				if (animate) {
					yield path;
				}
			}
		}
	}

	if (meetingPoint) {
		// path from startPoint to meetingPoint
		let currentPoint: PointData | null = meetingPoint;
		const forwardPoints = [];
		while (currentPoint) {
			forwardPoints.push(currentPoint);
			currentPoint = forwardCameFrom.get(currentPoint) || null;
		}
		forwardPoints.reverse();

		// path from meetingPoint to endPoint
		currentPoint = meetingPoint;
		const backwardPoints = [];
		while (currentPoint) {
			currentPoint = backwardCameFrom.get(currentPoint) || null;
			if (currentPoint) {
				backwardPoints.push(currentPoint);
			}
		}

		// combine forward and backward paths
		const points = [...forwardPoints, ...backwardPoints];

		for (const point of points) {
			path.points.push(point);
			if (animate) {
				yield path;
			}
		}
	}

	yield path;
}
