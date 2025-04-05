import type { PointData, Polygon } from "pixi.js";

function isPointInPolygon(
	point: PointData,
	polygon: Polygon | null,
	strokeWidth: number,
) {
	if (!polygon) return false;

	return (
		polygon.contains(point.x, point.y) ||
		polygon.strokeContains(point.x, point.y, strokeWidth, 0.5)
	);
}

export default function isPointInPolygons(
	point: PointData,
	polygons: Polygon[] | null,
	strokeWidth: number,
): boolean {
	if (!polygons) return false;

	return polygons.some((polygon) =>
		isPointInPolygon(point, polygon, strokeWidth),
	);
}
