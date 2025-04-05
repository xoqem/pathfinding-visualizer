import { PointData, pointInTriangle } from "pixi.js";

function pointInPolygon(point: PointData, polygon: PointData[] | null) {
  if (!polygon) return false;
console.log('>>>', polygon);
  for (let i = 0; i < polygon.length - 2; i++) {
    if (
      pointInTriangle(
        point.x,
        point.y,
        polygon[i].x,
        polygon[i].y,
        polygon[i + 1].x,
        polygon[i + 1].y,
        polygon[i + 2].x,
        polygon[i + 2].y
      )
    ) {
      return true;
    }
  }
  return false;
}

export default function pointInPolygons(
  point: PointData,
  polygons: PointData[][] | null
): boolean {
  if (!polygons) return false;

  return polygons.some((polygon) => pointInPolygon(point, polygon));
}