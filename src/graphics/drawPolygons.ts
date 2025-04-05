import type { Graphics, Polygon } from "pixi.js";

interface Params {
	alpha?: number;
	graphics: Graphics;
	polygons: Polygon[] | null;
	strokeWidth: number;
}

export default function drawPolygons({
	alpha = 1,
	graphics,
	polygons,
	strokeWidth,
}: Params) {
	if (!polygons) return;

	graphics.setStrokeStyle({
		alpha,
		color: "#000000",
		width: strokeWidth,
		alignment: 0.5,
		cap: "round",
		join: "round",
	});
	graphics.setFillStyle({ alpha, color: "#000000" });

	for (const polygon of polygons) {
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
