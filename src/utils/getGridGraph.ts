import { Polygon } from "pixi.js";

import Graph from "./graph";
import { doesPolygonIntersectPolygons } from "./polygon";

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
			} else {
				const point = {
					x: Math.round(x + gridSize / 2),
					y: Math.round(y + gridSize / 2),
				};

				graph.initializeGraphEntry(point);
			}

			yield { graph, overlayPolygons };
		}
	}

	for (const point of graph.points) {
		graph.connectPointToGraph({
			maxNeighbors: allowDiagonal ? 8 : 4,
			point,
			polygons,
		});

		yield { graph, overlayPolygons };
	}
}
