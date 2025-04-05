import { Application, extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback } from "react";

import "./App.css";
import useSvgPolygons from "./hooks/useSvgPolygons";

extend({
  Container,
  Graphics,
});

const WIDTH = 800;
const HEIGHT = 400;

export default function App() {
  const { polygons } = useSvgPolygons("./public/example.svg");

  const drawCallback = useCallback(
    (graphics: Graphics) => {
      graphics.clear();

      // set graphics background to white, with a black border
      graphics.setStrokeStyle({ color: "#000000", width: 1, alignment: 1 });
      graphics.setFillStyle({ color: "#ffffff" });
      graphics.rect(0, 0, WIDTH, HEIGHT);
      graphics.fill();
      graphics.stroke();

      graphics.setFillStyle({ color: "black" });

      // graphics.rect(0, 0, 100, 100);
      // graphics.fill();

      polygons?.forEach((polygon) => {
        graphics.poly(polygon);
      });
      graphics.fill();
    },
    [polygons]
  );

  return (
    <Application width={WIDTH} height={HEIGHT}>
      <pixiContainer x={0} y={0}>
        <pixiGraphics draw={drawCallback} />
      </pixiContainer>
    </Application>
  );
}
