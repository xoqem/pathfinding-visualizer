import { PointData, Polygon } from "pixi.js";

function isPointInPolygon(point: PointData, polygon: Polygon | null) {
  if (!polygon) return false;

  return (
    polygon.contains(point.x, point.y) ||
    polygon.strokeContains(point.x, point.y, 1, 0.5)
  );
}

export default function isPointInPolygons(
  point: PointData,
  polygons: Polygon[] | null
): boolean {
  if (!polygons) return false;

  return polygons.some((polygon) => isPointInPolygon(point, polygon));
}
