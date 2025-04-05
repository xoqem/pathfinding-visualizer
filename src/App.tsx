import { Application, extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useCallback, useEffect } from "react";

import "./App.css";

extend({
  Container,
  Graphics,
});

async function fetchSvgAsString(svgPath: string){
  const response = await fetch(svgPath);
  const svgString = await response.text();
  console.log(svgString);

  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");

  const polygons = svgDoc.querySelectorAll("polygon");
  polygons.forEach(polygon => {
    console.log(polygon.getAttribute("points"));
  });
}


export default function App() {
  useEffect(() => {
    fetchSvgAsString('./public/example.svg');
  }, []);

  const drawCallback = useCallback((graphics: Graphics) => {
    graphics.clear();
    graphics.setFillStyle({ color: "red" });
    graphics.rect(0, 0, 100, 100);
    graphics.fill();
  }, []);

  return (
    <Application>
      <pixiContainer x={100} y={100}>
        <pixiGraphics draw={drawCallback} />
      </pixiContainer>
    </Application>
  );
}
