import { Graphics, Polygon } from "pixi.js";

interface Params {
  graphics: Graphics;
  polygons: Polygon[] | null;
}

export default function drawPolygons({ graphics, polygons }: Params) {
  if (!polygons) return;

  graphics.setStrokeStyle({ color: "#000000", width: 1, alignment: 1 });
  graphics.setFillStyle({ color: "#000000" });

  polygons?.forEach((polygon) => {
    graphics.poly(polygon.points);
  });

  graphics.fill();
  graphics.stroke();
}
