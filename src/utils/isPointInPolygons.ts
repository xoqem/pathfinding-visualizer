import { PointData, Polygon } from "pixi.js";

function isPointInPolygon(point: PointData, polygon: Polygon | null) {
  if (!polygon) return false;

  return polygon.contains(point.x, point.y);
}

export default function isPointInPolygons(
  point: PointData,
  polygons: Polygon[] | null
): boolean {
  if (!polygons) return false;

  return polygons.some((polygon) => isPointInPolygon(point, polygon));
}
