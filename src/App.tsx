import { Application, extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback, useMemo } from "react";

import "./App.css";
import useSvgPolygons from "./hooks/useSvgPolygons";
import getProbabilisticRoadmapGraph from "./utils/getProbabilisticRoadmapGraph";

extend({
  Container,
  Graphics,
});

interface Props {
  height: number;
  width: number;
}

export default function App({ height, width }: Props) {
  const { loading, polygons } = useSvgPolygons('./public/example.svg');

  const graph = useMemo(() => {
    if (loading) return null;

    return getProbabilisticRoadmapGraph({ height, polygons, width });
  }, [height, loading, polygons, width]);

  const drawCallback = useCallback(
    (graphics: Graphics) => {
      graphics.clear();

      if (loading) {
        return;
      }

      // set graphics background to white, with a black border
      graphics.setStrokeStyle({ color: "#000000", width: 1, alignment: 1 });
      graphics.setFillStyle({ color: "#ffffff" });
      graphics.rect(0, 0, width, height);
      graphics.fill();
      graphics.stroke();

      graphics.setFillStyle({ color: "#000000" });

      polygons?.forEach((polygon) => {
        graphics.poly(polygon);
      });

      graphics.fill();
      graphics.stroke();

      if (graph) {
        const graphNodes = Object.values(graph);

        const renderedEdges = new Set<string>();
        graphNodes.forEach(({ neighbors, point }) => {
          neighbors.forEach(({ point: neighborPoint }) => {
            const edgePoints = [point, neighborPoint].sort((a, b) => a.x - b.x || a.y - b.y);
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
    },
    [graph, height, loading, polygons, width]
  );

  return (
    <Application width={width} height={height}>
      <pixiContainer x={0} y={0}>
        <pixiGraphics draw={drawCallback} />
      </pixiContainer>
    </Application>
  );
}
