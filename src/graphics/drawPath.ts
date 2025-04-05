import { Graphics } from "pixi.js";
import { Path } from "../utils/path";

interface Params {
  path: Path | null;
  graphics: Graphics;
}

export default function drawPath({ path, graphics }: Params) {
  if (!path) return;

  const { end, graph, points, start } = path;

  const graphNodes = Object.values(graph);

  graphNodes.forEach(({ parent, point }) => {
    if (!parent) return;
  
    graphics.setStrokeStyle({
      color: "#003300",
      width: 3,
      alignment: 0.5,
    });
    graphics.moveTo(point.x, point.y);
    graphics.lineTo(parent.point.x, parent.point.y);
    graphics.stroke();
    
  });

  // graphNodes.forEach(({ parent, point }) => {
  //   if (!parent) return;

  //   graphics.setStrokeStyle({ color: "#0000ff", width: 1, alignment: 0.5 });
  //   graphics.setFillStyle({ color: "#0000ff" });
  //   graphics.circle(point.x, point.y, 2);
  //   graphics.fill();
  //   graphics.stroke();
  // });

  graphics.setStrokeStyle({ color: "#0000ff", width: 1, alignment: 0.5 });
  graphics.setFillStyle({ color: "#0000ff" });
  graphics.circle(start.x, start.y, 4);
  graphics.fill();
  graphics.stroke();

  graphics.setStrokeStyle({ color: "#0000ff", width: 1, alignment: 0.5 });
  graphics.setFillStyle({ color: "#0000ff" });
  graphics.circle(end.x, end.y, 4);
  graphics.fill();
  graphics.stroke();

  graphics.setStrokeStyle({
    color: "#00ff00",
    width: 3,
    alignment: 0.5,
  });
  graphics.moveTo(start.x, start.y);
  points.forEach((point) => {
    graphics.lineTo(point.x, point.y);
  });
  graphics.stroke();
}
