import { Application, extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback, useMemo } from "react";

import useSvgPolygons from "./hooks/useSvgPolygons";
import getProbabilisticRoadmapGraph from "./utils/getProbabilisticRoadmapGraph";
import drawBackground from "./graphics/drawBackground";
import drawGraph from "./graphics/drawGraph";
import drawPolygons from "./graphics/drawPolygons";

extend({
  Container,
  Graphics,
});

interface Props {
  height: number;
  width: number;
}

export default function PixiApp({ height, width }: Props) {
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

      drawBackground({ graphics, height, width });
      drawPolygons({ graphics, polygons });
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
