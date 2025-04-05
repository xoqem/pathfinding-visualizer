import type { Graphics, Polygon } from "pixi.js";

interface Params {
	alpha?: number;
	overlay: Polygon[] | null;
	graphics: Graphics;
}

export default function drawGraph({ alpha = 1, overlay, graphics }: Params) {
	if (!overlay) return;

	graphics.setStrokeStyle({
		alpha,
		color: "#000000",
		width: 1,
		alignment: 0.5,
		cap: "round",
		join: "round",
	});
	graphics.setFillStyle({ alpha, color: "#000000" });

	for (const polygon of overlay) {
		if (polygon.points.length === 4) {
			graphics.moveTo(polygon.points[0], polygon.points[1]);
			graphics.lineTo(polygon.points[2], polygon.points[3]);
		} else {
			graphics.poly(polygon.points);
		}
	}

	graphics.fill();
	graphics.stroke();
}
