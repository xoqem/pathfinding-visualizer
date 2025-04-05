import { segmentIntersection } from "@pixi/math-extras";
import { PointData, Polygon } from "pixi.js";

function doesLineIntersectPolygon(
  lineStart: PointData,
  lineEnd: PointData,
  polygon: Polygon | null
): boolean {
  if (!polygon) return false;

  // interesting edge case: this doesn't check the last edge of the polygon, but since we know the
  // segment can't be inside the polygon, then a line entering the last edge of the polygon would
  // need to minimally cross one other edge, so it's faster to not add that extra check
  for (let i = 0; i < polygon.points.length - 3; i += 2) {
    const edgeStart = { x: polygon.points[i], y: polygon.points[i + 1] };
    const edgeEnd = { x: polygon.points[i + 2], y: polygon.points[i + 3] };

    const intersection = segmentIntersection(
      lineStart,
      lineEnd,
      edgeStart,
      edgeEnd
    );
    if (isFinite(intersection.x) && isFinite(intersection.y)) {
      return true;
    }
  }

  return false;
}

export default function doesLineIntersectPolygons(
  lineStart: PointData,
  lineEnd: PointData,
  polygons: Polygon[] | null
): boolean {
  if (!polygons) return false;

  return polygons.some((polygon) =>
    doesLineIntersectPolygon(lineStart, lineEnd, polygon)
  );
}
