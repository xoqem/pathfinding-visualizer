import type { Polygon } from "pixi.js";
import { doesLineIntersectPolygon } from "./doesLineIntersectPolygons";
import { isPointInPolygon } from "./isPointInPolygons";

export function doPolygonsIntersect(
	polygon1: Polygon,
	polygon2: Polygon,
	polygonStrokeWidth = 1,
): boolean {
	const points1 = polygon1.points;

	for (let i = 0; i < points1.length; i += 2) {
		const point = { x: points1[i], y: points1[i + 1] };
		if (isPointInPolygon(point, polygon2, polygonStrokeWidth)) {
			return true;
		}
	}

	for (let i = 0; i < points1.length; i += 2) {
		const start = { x: points1[i], y: points1[i + 1] };
		const end =
			i + 2 < points1.length
				? { x: points1[i + 2], y: points1[i + 3] }
				: { x: points1[0], y: points1[1] };
		if (doesLineIntersectPolygon(start, end, polygon2)) {
			return true;
		}
	}

	return false;
}

export function doesPolygonIntersectPolygons(
	polygon: Polygon,
	polygons: Polygon[] | null,
	polygonStrokeWidth = 1,
): boolean {
	if (!polygons) return false;

	for (const otherPolygon of polygons) {
		if (doPolygonsIntersect(polygon, otherPolygon, polygonStrokeWidth)) {
			return true;
		}
	}

	return false;
}
