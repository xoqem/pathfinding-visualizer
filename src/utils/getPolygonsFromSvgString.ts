import { PointData } from "pixi.js";

export default function getPolygonsFromSvgString(
  svgString: string | null
): PointData[][] | null {
  if (!svgString) return null;

  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const polygons = [...svgDoc.querySelectorAll("polygon")];

  return polygons
    .map((polygon) => {
      const pointsStr = polygon.getAttribute("points");

      const numbers = pointsStr
        // replace commas with spaces
        ?.replace(/,/g, " ")
        .trim()
        // split on white space
        .split(/\s+/)
        // convert to numbers
        .map(Number);

      if (!numbers?.length) return null;

      const points: PointData[] = [];
      for (let i = 0; i < numbers.length; i += 2) {
        points.push({ x: numbers[i], y: numbers[i + 1] });
      }

      return points;
    })
    .filter((points) => !!points);
}
