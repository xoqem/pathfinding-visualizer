
interface Params {
  height: number;
  numShapes?: number;
  width: number;
}

export default function generateSvgString({
  height,
  numShapes = 10,
  width,
}: Params) {
  // generate an svgString that has numShapes random polygons
  const polygons = Array.from({ length: numShapes }, () => {
    const numPoints = Math.floor(Math.random() * 5) + 3;
    const centerX = Math.random() * width;
    const centerY = Math.random() * height;
    const points = Array.from({ length: numPoints }, (_, i) => {
      const angle = (i / numPoints) * Math.PI * 2;
      const radius = Math.random() * (Math.min(width, height) / 3);
      const x = Math.cos(angle) * radius + centerX;
      const y = Math.sin(angle) * radius + centerY;
      return `${Math.floor(x)},${Math.floor(y)}`;
    }).join(" ");
   

    return `<polygon points="${points}" fill="solid" stroke="black" stroke-width="2"/>`;
  }).join("");

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${polygons}</svg>`;
}