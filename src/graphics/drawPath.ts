import type { Graphics } from "pixi.js";
import type { Path } from "../utils/path";

interface Params {
	path: Path | null;
	graphics: Graphics;
}

export default function drawPath({ path, graphics }: Params) {
	if (!path) return;

	const { end, graph, points, start } = path;

	const graphNodes = Object.values(graph);

	for (const node of graphNodes) {
		const { parent, point } = node;
		if (!parent) continue;

		graphics.setStrokeStyle({
			color: "#003300",
			width: 3,
			alignment: 0.5,
		});
		graphics.moveTo(point.x, point.y);
		graphics.lineTo(parent.point.x, parent.point.y);
		graphics.stroke();
	}

	// for (const { parent, point } of graphNodes) {
	// 	if (!parent) continue;

	// 	graphics.setStrokeStyle({ color: "#0000ff", width: 1, alignment: 0.5 });
	// 	graphics.setFillStyle({ color: "#0000ff" });
	// 	graphics.circle(point.x, point.y, 2);
	// 	graphics.fill();
	// 	graphics.stroke();
	// }

	graphics.setStrokeStyle({ color: "#0000ff", width: 1, alignment: 0.5 });
	graphics.setFillStyle({ color: "#0000ff" });
	graphics.circle(start.x, start.y, 4);
	graphics.fill();
	graphics.stroke();

	graphics.setStrokeStyle({ color: "#0000ff", width: 1, alignment: 0.5 });
	graphics.setFillStyle({ color: "#0000ff" });
	graphics.circle(end.x, end.y, 4);
	graphics.fill();
	graphics.stroke();

	graphics.setStrokeStyle({
		color: "#00ff00",
		width: 3,
		alignment: 0.5,
	});
	graphics.moveTo(start.x, start.y);
	for (const point of points) {
		graphics.lineTo(point.x, point.y);
	}
	graphics.stroke();
}
