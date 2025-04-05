import generateRandomPolygons from "./generateRandomPolygons";

interface Params {
  height: number;
  maxShapeSize?: number;
  numShapes?: number;
  width: number;
}

export default function generateSvgString({
  height,
  numShapes = 10,
  maxShapeSize = 20,
  width,
}: Params) {
  const polygons = generateRandomPolygons({
    height,
    maxShapeSize,
    numShapes,
    width,
  });

  const polygonNodes = polygons
    .map((points) => {
      const pointsStr = points
        .map(({ x, y }) => `${Math.floor(x)},${Math.floor(y)}`)
        .join(" ");

      return `<polygon points="${pointsStr}" fill="solid" stroke="black" stroke-width="2"/>`;
    })
    .join('');

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${polygonNodes}</svg>`;
}
