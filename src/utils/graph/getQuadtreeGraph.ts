import { type PointData, Polygon } from "pixi.js";

import { getDistance } from "../geometry/point";
import { doesPolygonIntersectPolygons } from "../geometry/polygon";
import Graph from "./graph";

interface QuadNode {
	i: number;
	j: number;
	depth: number;
	center: PointData;
	hasChildren: boolean;
}

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
	const maxSizeX = width / Math.floor(width / maxSize);
	const maxSizeY = height / Math.floor(height / maxSize);

	const graph: Graph = new Graph();
	const overlayPolygons: Polygon[] = [];

	const quadLayers: Array<Map<string, QuadNode>> = [];

	yield { graph, overlayPolygons };

	function subdivide(i: number, j: number, depth: number) {
		if (depth >= quadLayers.length) {
			quadLayers.push(new Map<string, QuadNode>());
		}

		const cellWidth = maxSizeX / 2 ** depth;
		const cellHeight = maxSizeY / 2 ** depth;
		const x = i * cellWidth;
		const y = j * cellHeight;

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

			quadLayers[depth].set(`${i},${j}`, {
				i,
				j,
				depth,
				center: point,
				hasChildren: false,
			});

			return;
		}

		if (cellWidth <= minSize || cellHeight <= minSize) {
			overlayPolygons.push(overlayPolygon);
			return;
		}

		// subdivide into four quads
		subdivide(i * 2, j * 2, depth + 1); // Top-left
		subdivide(i * 2 + 1, j * 2, depth + 1); // Top-right
		subdivide(i * 2, j * 2 + 1, depth + 1); // Bottom-left
		subdivide(i * 2 + 1, j * 2 + 1, depth + 1); // Bottom-right

		quadLayers[depth].set(`${i},${j}`, {
			i,
			j,
			depth,
			center: point,
			hasChildren: true,
		});
	}

	for (let i = 0; i < Math.floor(width / maxSizeX); i++) {
		for (let j = 0; j < Math.floor(height / maxSizeY); j++) {
			subdivide(i, j, 0);
			yield { graph, overlayPolygons };
		}
	}

	function findNeighborsForDirection(
		i: number,
		j: number,
		dx: number,
		dy: number,
		depth: number,
	): QuadNode[] {
		const neighbor = quadLayers[depth].get(`${i + dx},${j + dy}`);
		if (!neighbor) return [];

		if (!neighbor.hasChildren) {
			return [neighbor];
		}

		if (dy === 0) {
			// when going right, we have to add 1 since subdivision creates an extra column to the right
			const iShift = dx < 0 ? 0 : 1;
			const newI = i * 2 + iShift;
			const newJ = j * 2;
			return [
				...findNeighborsForDirection(newI, newJ, dx, dy, depth + 1),
				...findNeighborsForDirection(newI, newJ, dx, dy + 1, depth + 1),
			];
		}

		if (dx === 0) {
			// when going down, we have to add 1 since subdivision creates an extra row below
			const jShift = dy < 0 ? 0 : 1;
			const newI = i * 2;
			const newJ = j * 2 + jShift;
			return [
				...findNeighborsForDirection(newI, newJ, dx, dy, depth + 1),
				...findNeighborsForDirection(newI, newJ, dx + 1, dy, depth + 1),
			];
		}

		return [];
	}

	function findNeighbors(i: number, j: number, depth: number): QuadNode[] {
		return [
			...findNeighborsForDirection(i, j, -1, 0, depth), // left
			...findNeighborsForDirection(i, j, 1, 0, depth), // right
			...findNeighborsForDirection(i, j, 0, -1, depth), // top
			...findNeighborsForDirection(i, j, 0, 1, depth), // bottom
		];
	}

	for (let depth = 0; depth < quadLayers.length; depth++) {
		const layer = quadLayers[depth];
		for (const [_key, node] of layer) {
			if (node.hasChildren) {
				continue;
			}

			graph.initializeGraphEntry(node.center);
			const neighbors = findNeighbors(node.i, node.j, node.depth);
			for (const neighbor of neighbors) {
				graph.addNeighbor({
					point: node.center,
					neighbor: {
						point: neighbor.center,
						cost: getDistance(node.center, neighbor.center),
					},
				});
			}
		}
	}

	yield { graph, overlayPolygons };
}
