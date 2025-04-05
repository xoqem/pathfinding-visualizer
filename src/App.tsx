import { Application, extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback, useMemo } from "react";

import "./App.css";
import useSvgPolygons from "./hooks/useSvgPolygons";
import getProbabilisticRoadmapGraph from "./utils/getProbabilisticRoadmapGraph";
import drawGraph from "./graphics/drawGraph";

extend({
  Container,
  Graphics,
});

interface Props {
  height: number;
  width: number;
}

export default function App({ height, width }: Props) {
  const { loading, polygons } = useSvgPolygons("./public/example.svg");

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
        graphics.poly(polygon.points);
      });

      graphics.fill();
      graphics.stroke();

      drawGraph({ graph, graphics });
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
