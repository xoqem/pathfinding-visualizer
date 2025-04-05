import { PointData, Polygon } from "pixi.js";

import { addNeighbor, Graph, Neighbor, sortNeighborsByCost } from "./graph";
import isPointInPolygons from "./isPointInPolygons";
import { arePointsEqual, getDistance } from "./point";
import doesLineIntersectPolygons from "./doesLineIntersectPolygons";

interface Params {
  height: number;
  maxNeighborDistance?: number;
  maxNeighbors?: number;
  numSamples?: number;
  polygons: Polygon[] | null;
  randomize?: boolean;
  width: number;
}

export default function getProbabilisticRoadmapGraph({
  height,
  maxNeighborDistance = 100,
  maxNeighbors = 8,
  numSamples = 400,
  polygons,
  randomize = true,
  width,
}: Params): Graph {
  const points: PointData[] = [];

  const padding = 1;
  const widthWithPadding = width - padding * 2;
  const heightWithPadding = height - padding * 2;

  if (randomize) {
    for (let i = 0; i < numSamples; i++) {
      const x = Math.round(Math.random() * widthWithPadding) + padding;
      const y = Math.round(Math.random() * heightWithPadding) + padding;
      const point = { x, y };

      if (isPointInPolygons(point, polygons)) continue;

      points.push(point);
    }
  } else {
    const step = Math.ceil(
      Math.sqrt((widthWithPadding * heightWithPadding) / numSamples)
    );
    const gridWidth = (Math.ceil(widthWithPadding / step) - 1) * step;
    const gridHeight = (Math.ceil(heightWithPadding / step) - 1) * step;
    const startX = Math.floor((widthWithPadding - gridWidth) / 2);
    const startY = Math.floor((heightWithPadding - gridHeight) / 2);
    console.log({ step, gridWidth, gridHeight, startX, startY });

    for (let x = startX; x < widthWithPadding; x += step) {
      for (let y = startY; y < heightWithPadding; y += step) {
        const point = { x, y };

        if (isPointInPolygons(point, polygons)) continue;

        points.push(point);
      }
    }
  }

  const graph: Graph = {};

  points.forEach((point) => {
    const neighbors: Neighbor[] = [];
    points.forEach((neighborPoint) => {
      if (arePointsEqual(point, neighborPoint)) return;

      const distance = getDistance(point, neighborPoint);
      if (maxNeighborDistance && distance > maxNeighborDistance) return;

      if (doesLineIntersectPolygons(point, neighborPoint, polygons)) return;

      neighbors.push({
        cost: distance,
        point: neighborPoint,
      });
    });

    sortNeighborsByCost(neighbors)
      .slice(0, maxNeighbors)
      .forEach((neighbor) => {
        addNeighbor({ graph, point, neighbor });
      });
  });

  return graph;
}
