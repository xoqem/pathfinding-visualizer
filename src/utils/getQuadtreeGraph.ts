import { Polygon } from "pixi.js";

import Graph from "./graph";
import { doesPolygonIntersectPolygons } from "./polygon";

interface Params {
	height: number;
	maxSize: number; // maximum size of the quadtree cells
	minSize: number; // minimum size of the quadtree cells
	polygons: Polygon[] | null;
	polygonStrokeWidth: number;
	width: number;
}

export default function* getQuadtreeGraph({
	height,
	maxSize,
	minSize,
	polygons,
	polygonStrokeWidth,
	width,
}: Params): Generator<{ graph: Graph; overlayPolygons: Polygon[] }> {
	const graph: Graph = new Graph();
	const overlayPolygons: Polygon[] = [];
	const blockingPolygons: Polygon[] = [];

	yield { graph, overlayPolygons };

	function subdivide(
		x: number,
		y: number,
		cellWidth: number,
		cellHeight: number,
	): void {
		const overlayPolygonPoints = [
			{ x, y },
			{ x: x + cellWidth, y },
			{ x: x + cellWidth, y: y + cellHeight },
			{ x, y: y + cellHeight },
		];
		const overlayPolygon = new Polygon(overlayPolygonPoints);

		const point = {
			x: Math.round(x + cellWidth / 2),
			y: Math.round(y + cellHeight / 2),
		};

		if (
			!doesPolygonIntersectPolygons(
				overlayPolygon,
				polygons,
				polygonStrokeWidth,
			)
		) {
			overlayPolygons.push(
				new Polygon([overlayPolygonPoints[0], overlayPolygonPoints[1]]),
			);
			overlayPolygons.push(
				new Polygon([overlayPolygonPoints[1], overlayPolygonPoints[2]]),
			);
			overlayPolygons.push(
				new Polygon([overlayPolygonPoints[2], overlayPolygonPoints[3]]),
			);
			overlayPolygons.push(
				new Polygon([overlayPolygonPoints[3], overlayPolygonPoints[0]]),
			);

			graph.initializeGraphEntry(point);
			return;
		}

		if (cellWidth <= minSize || cellHeight <= minSize) {
			overlayPolygons.push(overlayPolygon);
			blockingPolygons.push(overlayPolygon);
			return;
		}

		const halfWidth = cellWidth / 2;
		const halfHeight = cellHeight / 2;

		// Subdivide into four quadrants
		subdivide(x, y, halfWidth, halfHeight); // Top-left
		subdivide(x + halfWidth, y, halfWidth, halfHeight); // Top-right
		subdivide(x, y + halfHeight, halfWidth, halfHeight); // Bottom-left
		subdivide(x + halfWidth, y + halfHeight, halfWidth, halfHeight); // Bottom-right
	}

	subdivide(0, 0, width, height);

	const maxNeighborDistance = maxSize * 2;

	for (const point of graph.points) {
		graph.connectPointToGraph({
			maxNeighborDistance,
			maxNeighbors: 16,
			point,
			polygons: blockingPolygons,
		});

		yield { graph, overlayPolygons };
	}
}
