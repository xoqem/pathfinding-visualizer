import type { Graphics } from "pixi.js";
import type { Overlay } from "../context/AppContext";

interface Params {
	alpha?: number;
	overlay: Overlay | null;
	graphics: Graphics;
}

export default function drawOverlay({ alpha = 1, overlay, graphics }: Params) {
	if (!overlay) return;

	if (overlay.outlinePolygons) {
		graphics.setStrokeStyle({
			alpha,
			color: "#000000",
			width: 1,
			alignment: 0.5,
			cap: "round",
			join: "round",
		});
		graphics.setFillStyle({ alpha, color: "#000000" });

		for (const polygon of overlay.outlinePolygons) {
			if (polygon.points.length === 4) {
				graphics.moveTo(polygon.points[0], polygon.points[1]);
				graphics.lineTo(polygon.points[2], polygon.points[3]);
			} else {
				graphics.poly(polygon.points);
			}
		}

		graphics.stroke();
	}

	if (overlay.filledPolygons) {
		graphics.setStrokeStyle({
			alpha,
			color: "#000000",
			width: 1,
			alignment: 0.5,
			cap: "round",
			join: "round",
		});
		graphics.setFillStyle({ alpha, color: "#000000" });

		for (const polygon of overlay.filledPolygons) {
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
}
