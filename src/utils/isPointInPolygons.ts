import { PointData, Polygon } from "pixi.js";

function isPointInPolygon(point: PointData, polygon: PointData[] | null) {
  if (!polygon) return false;

  return new Polygon(polygon).contains(point.x, point.y);
}

export default function isPointInPolygons(
  point: PointData,
  polygons: PointData[][] | null
): boolean {
  if (!polygons) return false;

  return polygons.some((polygon) => isPointInPolygon(point, polygon));
}
