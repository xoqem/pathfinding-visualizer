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

	yield { graph, overlayPolygons };

	function subdivide(
		x: number,
		y: number,
		cellWidth: number,
		cellHeight: number,
	): void {
		const overlayPolygonPoints = [
			{ x: Math.max(x, 1), y },
			{ x: x + cellWidth, y },
			{ x: x + cellWidth, y: Math.min(y + cellHeight, height - 1) },
			{ x: Math.max(x, 1), y: Math.min(y + cellHeight, height - 1) },
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

	const maxSizeX = width / Math.floor(width / maxSize);
	const maxSizeY = height / Math.floor(height / maxSize);

	for (let x = 0; x < width; x += maxSizeX) {
		for (let y = 0; y < height; y += maxSizeY) {
			subdivide(x, y, maxSizeX, maxSizeY);
		}
	}

	const maxNeighborDistance = maxSize * 2;

	for (const point of graph.points) {
		graph.connectPointToGraph({
			maxNeighborDistance,
			maxNeighbors: 8,
			point,
			polygons,
		});

		yield { graph, overlayPolygons };
	}
}
