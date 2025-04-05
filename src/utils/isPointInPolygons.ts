import { PointData, pointInTriangle } from "pixi.js";

function isPointInPolygon(point: PointData, polygon: PointData[] | null) {
  if (!polygon) return false;

  for (let i = 1; i < polygon.length - 1; i++) {
    if (
      pointInTriangle(
        point.x,
        point.y,
        polygon[0].x,
        polygon[0].y,
        polygon[i].x,
        polygon[i].y,
        polygon[i + 1].x,
        polygon[i + 1].y
      )
    ) {
      return true;
    }
  }
  return false;
}

export default function isPointInPolygons(
  point: PointData,
  polygons: PointData[][] | null
): boolean {
  if (!polygons) return false;

  return polygons.some((polygon) => isPointInPolygon(point, polygon));
}
