import { Application, extend } from "@pixi/react";
import { Container, Graphics, PointData } from "pixi.js";
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
      graphics.fill();
      graphics.stroke();

      // generate random points, discarding any that are inside the polygons
      const points: PointData[] = [];
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * WIDTH;
        const y = Math.random() * HEIGHT;
        const point = { x, y };
        
        if (pointInPolygons(point, polygons)) continue;

        points.push(point);
      }

      // key: "x,y" string, value: array of 5 nearest neighbors
      const neighbors: { [key: string]: PointData[] } = {};

      function distance(a: PointData, b: PointData) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
      }

      points.forEach((point) => {
        const key = `${point.x},${point.y}`;
        neighbors[key] = [];

        // add 5 nearest points to neighbors[key]
        points.forEach((otherPoint) => {
          if (point === otherPoint) return;
          
          if (neighbors[key].includes(otherPoint)) return;
            neighbors[key].push(otherPoint);
            const otherKey = `${otherPoint.x},${otherPoint.y}`;
            if (!neighbors[otherKey]) {
              neighbors[otherKey] = [];
            }
            neighbors[otherKey].push(point);          
        });
      });

      points.forEach((point) => {
        const key = `${point.x},${point.y}`;
        neighbors[key] = neighbors[key].sort((a, b) => distance(a, point) - distance(b, point)).slice(0, 5);
      });

      console.log(neighbors);

      points.forEach((point) => {
        graphics.setStrokeStyle({ color: "#0000ff", width: 1, alignment: 1 });
        graphics.setFillStyle({ color: "#0000ff" });
        graphics.circle(point.x, point.y, 2);
        graphics.fill();
        graphics.stroke();
      });

      // draw paths between points and their neighbors
      points.forEach((point) => {
        neighbors[`${point.x},${point.y}`]?.forEach((neighbor) => {
          graphics.setStrokeStyle({ color: "#ff0000", width: 1, alignment: 1 });
          // graphics.lineStyle(1, 0xff0000);
          graphics.moveTo(point.x, point.y);
          graphics.lineTo(neighbor.x, neighbor.y);
          graphics.stroke();
        });
      });

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
