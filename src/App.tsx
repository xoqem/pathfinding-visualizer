import { Application, extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback } from "react";

import "./App.css";
import useSvgPolygons from "./hooks/useSvgPolygons";
import pointInPolygons from "./utils/pointInPolygons";

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

      graphics.setFillStyle({ color: "#000000" });

      polygons?.forEach((polygon) => {
        graphics.poly(polygon);
      });
      // graphics.fill();
      graphics.stroke();

      // generate 100 random points, if pointInPolygons returns true, color the point red, otherwise color it green
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * WIDTH;
        const y = Math.random() * HEIGHT;
        const point = { x, y };
        if (pointInPolygons(point, polygons)) {
          graphics.setStrokeStyle({ color: "#ff0000", width: 1, alignment: 1 });
          graphics.setFillStyle({ color: "#ff0000" });
        } else {
          graphics.setStrokeStyle({ color: "#00ff00", width: 1, alignment: 1 });
          graphics.setFillStyle({ color: "#00ff00" });
        }
        graphics.circle(x, y, 2);
        graphics.fill();
        graphics.stroke();
      }
        
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
