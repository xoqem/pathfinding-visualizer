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
  const text = await response.text();
  console.log(text);
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
