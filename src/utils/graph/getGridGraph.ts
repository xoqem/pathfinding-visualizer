import { type PointData, Polygon } from "pixi.js";

import { getDistance } from "../geometry/point";
import { doesPolygonIntersectPolygons } from "../geometry/polygon";
import Graph from "./graph";

interface Params {
	allowDiagonal: boolean;
	gridSize: number;
	height: number;
	polygons: Polygon[] | null;
	polygonStrokeWidth: number;
	width: number;
}

export default function* getGridGraph({
	allowDiagonal,
	gridSize,
	height,
	polygons,
	polygonStrokeWidth,
	width,
}: Params): Generator<{ graph: Graph; overlayPolygons: Polygon[] }> {
	const graph: Graph = new Graph();
	const overlayPolygons: Polygon[] = [];
	const gridPoints: (PointData | null)[][] = [];

	yield { graph, overlayPolygons };

	const stepX = width / Math.floor(width / gridSize);
	const stepY = height / Math.floor(height / gridSize);

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
					x: Math.round(x + gridSize / 2),
					y: Math.round(y + gridSize / 2),
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

			if (allowDiagonal) {
				const upperRightPoint = gridPoints[i + 1]?.[j - 1];
				if (upperRightPoint) {
					graph.addNeighbor({
						point,
						neighbor: {
							point: upperRightPoint,
							cost: getDistance(point, upperRightPoint),
						},
					});
				}

				const lowerRightPoint = gridPoints[i + 1]?.[j + 1];
				if (lowerRightPoint) {
					graph.addNeighbor({
						point,
						neighbor: {
							point: lowerRightPoint,
							cost: getDistance(point, lowerRightPoint),
						},
					});
				}
			}

			yield { graph, overlayPolygons };
		}
	}
}
