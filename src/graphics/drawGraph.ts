import { Graphics } from "pixi.js";
import { Graph } from "../utils/graph";

interface Params {
  graph: Graph | null;
  graphics: Graphics;
}

export default function drawGraph({ graph, graphics }: Params) {
  if (!graph) return;

  const graphNodes = Object.values(graph);

  const renderedEdges = new Set<string>();
  graphNodes.forEach(({ neighbors, point }) => {
    neighbors.forEach(({ point: neighborPoint }) => {
      const edgePoints = [point, neighborPoint].sort(
        (a, b) => a.x - b.x || a.y - b.y
      );
      const edgeKey = `${edgePoints[0].x},${edgePoints[0].y}-${edgePoints[1].x},${edgePoints[1].y}`;
      if (renderedEdges.has(edgeKey)) return;
      renderedEdges.add(edgeKey);

      graphics.setStrokeStyle({
        color: "#ff0000",
        width: 1,
        alignment: 1,
      });
      graphics.moveTo(point.x, point.y);
      graphics.lineTo(neighborPoint.x, neighborPoint.y);
      graphics.stroke();
    });
  });

  graphNodes.forEach(({ point }) => {
    graphics.setStrokeStyle({ color: "#0000ff", width: 1, alignment: 1 });
    graphics.setFillStyle({ color: "#0000ff" });
    graphics.circle(point.x, point.y, 2);
    graphics.fill();
    graphics.stroke();
  });
}
