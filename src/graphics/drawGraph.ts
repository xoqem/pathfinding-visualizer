import type { Graphics } from "pixi.js";
import type { Graph } from "../utils/graph";

interface Params {
	alpha?: number;
	graph: Graph | null;
	graphics: Graphics;
}

export default function drawGraph({ alpha = 1, graph, graphics }: Params) {
	if (!graph) return;

	const graphNodes = Object.values(graph);

	const renderedEdges = new Set<string>();
	for (const { neighbors, point } of graphNodes) {
		for (const { point: neighborPoint } of neighbors) {
			const edgePoints = [point, neighborPoint].sort(
				(a, b) => a.x - b.x || a.y - b.y,
			);
			const edgeKey = `${edgePoints[0].x},${edgePoints[0].y}-${edgePoints[1].x},${edgePoints[1].y}`;
			if (renderedEdges.has(edgeKey)) continue;
			renderedEdges.add(edgeKey);

			graphics.setStrokeStyle({
				alpha,
				color: "#ff0000",
				width: 1,
				alignment: 0.5,
			});
			graphics.moveTo(point.x, point.y);
			graphics.lineTo(neighborPoint.x, neighborPoint.y);
			graphics.stroke();
		}
	}

	for (const { point } of graphNodes) {
		graphics.setStrokeStyle({
			alpha,
			color: "#0000ff",
			width: 1,
			alignment: 0.5,
		});
		graphics.setFillStyle({ alpha, color: "#0000ff" });
		graphics.circle(point.x, point.y, 2);
		graphics.fill();
		graphics.stroke();
	}
}
