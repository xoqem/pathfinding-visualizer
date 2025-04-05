import type { Graphics } from "pixi.js";
import type { Path } from "../utils/path/path";

interface Params {
	path: Path | null;
	pathAlpha?: number;
	graphics: Graphics;
	searchAlpha?: number;
}

export default function drawPath({
	path,
	pathAlpha = 1,
	graphics,
	searchAlpha = 0.6,
}: Params) {
	if (!path) return;

	const { endPoint, graph, points, startPoint } = path;

	// search branches
	for (const node of graph.nodes) {
		const { parent, point } = node;
		if (!parent) continue;

		graphics.setStrokeStyle({
			alpha: searchAlpha,
			color: "#003300",
			width: 2,
			alignment: 0.5,
		});
		graphics.moveTo(point.x, point.y);
		graphics.lineTo(parent.point.x, parent.point.y);
		graphics.stroke();
	}

	// start point
	graphics.setStrokeStyle({ color: "#0000ff", width: 1, alignment: 0.5 });
	graphics.setFillStyle({ color: "#0000ff" });
	graphics.circle(startPoint.x, startPoint.y, 4);
	graphics.fill();
	graphics.stroke();

	// end point
	graphics.setStrokeStyle({ color: "#0000ff", width: 1, alignment: 0.5 });
	graphics.setFillStyle({ color: "#0000ff" });
	graphics.circle(endPoint.x, endPoint.y, 4);
	graphics.fill();
	graphics.stroke();

	// path from start to end
	graphics.setStrokeStyle({
		alpha: pathAlpha,
		color: "#00dd00",
		width: 4,
		alignment: 0.5,
	});
	graphics.moveTo(startPoint.x, startPoint.y);
	for (const point of points) {
		graphics.lineTo(point.x, point.y);
	}
	graphics.stroke();

	// nodes in search search branches
	for (const { parent, point } of graph.nodes) {
		if (!parent) continue;

		graphics.setStrokeStyle({
			alpha: searchAlpha,
			color: "#0000ff",
			width: 1,
			alignment: 0.5,
		});
		graphics.setFillStyle({ alpha: searchAlpha, color: "#0000ff" });
		graphics.circle(point.x, point.y, 2);
		graphics.fill();
		graphics.stroke();
	}
}
