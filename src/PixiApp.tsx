import { Application, extend } from "@pixi/react";
import { Container, Graphics, Polygon } from "pixi.js";
import { useCallback } from "react";

import drawBackground from "./graphics/drawBackground";
import drawGraph from "./graphics/drawGraph";
import drawPolygons from "./graphics/drawPolygons";
import { Graph } from "./utils/graph";

extend({
  Container,
  Graphics,
});

interface Props {
  graph: Graph | null;
  height: number;
  polygons: Polygon[] | null;
  width: number;
}

export default function PixiApp({ graph, height, polygons, width }: Props) {
  const drawCallback = useCallback(
    (graphics: Graphics) => {
      graphics.clear();

      drawBackground({ graphics, height, width });
      drawPolygons({ graphics, polygons });
      drawGraph({ graph, graphics });
    },
    [graph, height, polygons, width]
  );

  return (
    <Application width={width} height={height}>
      <pixiContainer x={0} y={0}>
        <pixiGraphics draw={drawCallback} />
      </pixiContainer>
    </Application>
  );
}
