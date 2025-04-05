import type { PointData, Polygon } from "pixi.js";
import { arePointsEqual } from "../geometry/point";
import type Graph from "../graph/graph";
import type { GraphNode } from "../graph/graph";
import type { Path } from "./path";

interface Params {
	animate?: boolean;
	endPoint: PointData;
	graph: Graph;
	polygons: Polygon[] | null;
	startPoint: PointData;
}

export default function* getBreadthFirstPath({
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

	const queue = new Array<PointData>();
	queue.push(startPoint);

	while (queue.length) {
		const currentPoint = queue.shift();

		if (!currentPoint) {
			throw new Error("Unexpected falsy currentPoint value");
		}

		if (currentPoint === endPoint) {
			let node: GraphNode | null = pathGraph.getNode(endPoint);
			const points = [];
			while (node) {
				points.push(node.point);
				node = node.parent ? pathGraph.getNode(node.parent.point) : null;
			}

			points.reverse();

			for (const point of points) {
				path.points.push(point);
				if (animate) {
					yield path;
				}
			}

			// we're done, so break out of the main while loop
			break;
		}

		for (const neighbor of pathGraph.getNode(currentPoint).neighbors) {
			const neighborNode = pathGraph.getNode(neighbor.point);

			if (neighborNode.parent || neighborNode.point === startPoint) continue;

			queue.push(neighbor.point);

			pathGraph.getNode(neighbor.point).parent = {
				point: currentPoint,
				cost: neighbor.cost,
			};

			if (animate) {
				yield path;
			}
		}
	}

	yield path;
}
