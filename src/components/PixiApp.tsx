import { Application, extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback } from "react";

import drawBackground from "../graphics/drawBackground";
import drawGraph from "../graphics/drawGraph";
import drawPolygons from "../graphics/drawPolygons";
import { useAppContext } from "../context/AppContext";

extend({
  Container,
  Graphics,
});

export default function PixiApp() {
  const { graph, height, polygons, polygonStrokeWidth, width } = useAppContext();

  const drawCallback = useCallback(
    (graphics: Graphics) => {
      graphics.clear();

      drawBackground({ graphics, height, width });
      drawPolygons({ graphics, polygons, strokeWidth: polygonStrokeWidth });
      drawGraph({ graph, graphics });
    },
    [graph, height, polygons, polygonStrokeWidth, width]
  );

  return (
    <Application width={width} height={height}>
      <pixiContainer x={0} y={0}>
        <pixiGraphics draw={drawCallback} />
      </pixiContainer>
    </Application>
  );
}
