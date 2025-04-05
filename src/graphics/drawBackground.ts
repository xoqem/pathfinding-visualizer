import { Graphics } from "pixi.js";

interface Params {
  graphics: Graphics;
  height: number;
  width: number;
}

export default function drawBackground({ graphics, height, width }: Params) {
  graphics.setStrokeStyle({ color: "#000000", width: 1, alignment: 1 });
  graphics.setFillStyle({ color: "#ffffff" });
  graphics.rect(0, 0, width, height);
  graphics.fill();
  graphics.stroke();
}
