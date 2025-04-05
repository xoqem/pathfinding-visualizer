import { type PointData, Polygon } from "pixi.js";

import Graph from "./graph";
import { getDistance } from "./point";
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
	const gridPoints: (PointData | null)[][] = [];

	yield { graph, overlayPolygons };

	const stepX = width / Math.floor(width / maxSize);
	const stepY = height / Math.floor(height / maxSize);

	// vertical grid lines
	for (let x = 0; x <= width; x += stepX) {
		const floorX = Math.max(Math.floor(x), 1);
		overlayPolygons.push(new Polygon([floorX, 0, floorX, height]));
		yield { graph, overlayPolygons };
	}

	// horizontal grid lines
	for (let y = 0; y <= height; y += stepY) {
		const floorY = Math.min(Math.floor(y), height - 1);
		overlayPolygons.push(new Polygon([0, floorY, width, floorY]));
		yield { graph, overlayPolygons };
	}

	for (let x = 0; x < width; x += stepX) {
		const columnPoints: (PointData | null)[] = [];
		for (let y = 0; y < height; y += stepY) {
			const startX = Math.floor(x);
			const startY = Math.floor(y);
			const endX = Math.ceil(x + stepX);
			const endY = Math.ceil(y + stepY);

			const overlayPolygon = new Polygon([
				startX,
				startY,
				endX,
				startY,
				endX,
				endY,
				startX,
				endY,
			]);

			if (
				doesPolygonIntersectPolygons(
					overlayPolygon,
					polygons,
					polygonStrokeWidth,
				)
			) {
				overlayPolygons.push(overlayPolygon);

				columnPoints.push(null);
			} else {
				const point = {
					x: Math.round(x + maxSize / 2),
					y: Math.round(y + maxSize / 2),
				};

				columnPoints.push(point);
				graph.initializeGraphEntry(point);
			}

			yield { graph, overlayPolygons };
		}
		gridPoints.push(columnPoints);
	}

	for (let i = 0; i < gridPoints.length; i++) {
		for (let j = 0; j < gridPoints[i].length; j++) {
			const point = gridPoints[i][j];
			if (!point) continue;

			const rightPoint = gridPoints[i + 1]?.[j];
			if (rightPoint) {
				graph.addNeighbor({
					point,
					neighbor: { point: rightPoint, cost: getDistance(point, rightPoint) },
				});
			}

			const downPoint = gridPoints[i]?.[j + 1];
			if (downPoint) {
				graph.addNeighbor({
					point,
					neighbor: { point: downPoint, cost: getDistance(point, downPoint) },
				});
			}

			yield { graph, overlayPolygons };
		}
	}
}
