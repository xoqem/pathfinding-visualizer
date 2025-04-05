import { segmentIntersection } from '@pixi/math-extras';
import { PointData } from 'pixi.js';

function doesLineIntersectPolygon(
  lineStart: PointData,
  lineEnd: PointData,
  polygon: PointData[] | null
): boolean {
  if (!polygon) return false;

  for (let i = 1; i < polygon.length; i++) {
    const edgeStart = polygon[i - 1];
    const edgeEnd = polygon[i];

    const intersection = segmentIntersection(lineStart, lineEnd, edgeStart, edgeEnd);
    if (isFinite(intersection.x) && isFinite(intersection.y)) {
      return true;
    }
  }
  
  return false;
}

export default function doesLineIntersectPolygons(
  lineStart: PointData,
  lineEnd: PointData,
  polygons: PointData[][] | null
): boolean {
  if (!polygons) return false;

  return polygons.some((polygon) => doesLineIntersectPolygon(lineStart, lineEnd, polygon));
}
