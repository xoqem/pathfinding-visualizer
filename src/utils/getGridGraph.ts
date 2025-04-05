import type { Polygon } from "pixi.js";

import Graph from "./graph";
import isPointInPolygons from "./isPointInPolygons";

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
}: Params): Generator<Graph> {
	const graph: Graph = new Graph();
	const padding = 1;
	const widthWithPadding = width - padding * 2;
	const heightWithPadding = height - padding * 2;

	yield graph;

	const gridWidth = (Math.ceil(widthWithPadding / gridSize) - 1) * gridSize;
	const gridHeight = (Math.ceil(heightWithPadding / gridSize) - 1) * gridSize;
	const startX = Math.floor((widthWithPadding - gridWidth) / 2);
	const startY = Math.floor((heightWithPadding - gridHeight) / 2);

	for (let x = startX; x < widthWithPadding; x += gridSize) {
		for (let y = startY; y < heightWithPadding; y += gridSize) {
			const point = { x, y };

			if (isPointInPolygons(point, polygons, polygonStrokeWidth + 2)) continue;

			graph.initializeGraphEntry(point);

			yield graph;
		}
	}

	for (const point of graph.points) {
		graph.connectPointToGraph({
			maxNeighbors: allowDiagonal ? 8 : 4,
			point,
			polygons,
		});

		yield graph;
	}
}
