import { PointData, Polygon } from "pixi.js";

interface Params {
  height: number;
  scaleToFit: boolean;
  svgString: string | null;
  width: number;
}

export default function getPolygonsFromSvgString({
  height,
  scaleToFit,
  svgString,
  width,
}: Params): Polygon[] | null {
  if (!svgString) return null;

  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = svgDoc.querySelector("svg");
  const svgWidth = Number(svgElement?.getAttribute("width"));
  const svgHeight = Number(svgElement?.getAttribute("height"));
  const lineNodes = [...svgDoc.querySelectorAll("line")];
  const polygonNodes = [...svgDoc.querySelectorAll("polygon")];

  const widthScale = width / Number(svgWidth);
  const heightScale = height / Number(svgHeight);

  function scalePointsToFit(points: PointData[] | null) {
    if (!points) return null;

    if (scaleToFit) {
      return points.map((point) => {
        return {
          x: point.x * widthScale,
          y: point.y * heightScale,
        };
      });
    }

    const allPointsOutOfView = points.every((point) => {
      return point.x > width || point.y > height || point.x < 0 || point.y < 0;
    });

    if (allPointsOutOfView) return null;
    
    return points;
  }

  const linePoints = lineNodes.map((line) => {
    const x1 = line.getAttribute("x1");
    const x2 = line.getAttribute("x2");
    const y1 = line.getAttribute("y1");
    const y2 = line.getAttribute("y2");

    if (x1 === null || x2 === null || y1 === null || y2 === null) return null;

    const points = [
      { x: Number(x1), y: Number(y1) },
      { x: Number(x2), y: Number(y2) },
    ];

    return points;
  });

  const polygonPoints = polygonNodes.map((polygon) => {
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
  });

  const allPoints = [...linePoints, ...polygonPoints];

  const polygons = allPoints
    .map((points) => scalePointsToFit(points))
    .filter((points) => !!points)
    .map((points) => new Polygon(points));

  return polygons;
}
