import { PointData, Polygon } from "pixi.js";

import { connectPointToGraph, Graph, initializeGraphEntry } from "./graph";
import isPointInPolygons from "./isPointInPolygons";
import { getDistance } from "./point";

interface Params {
  height: number;
  maxNeighborDistance?: number;
  maxNeighbors?: number;
  numSamples?: number;
  oversampleFactor?: number;
  polygons: Polygon[] | null;
  polygonStrokeWidth: number;
  randomize?: boolean;
  randomPointBuffer?: number;
  width: number;
}

export default function getProbabilisticRoadmapGraph({
  height,
  maxNeighborDistance = 100,
  maxNeighbors = 8,
  numSamples = 400,
  polygons,
  polygonStrokeWidth,
  randomize = true,
  randomPointBuffer = 10,
  oversampleFactor = 2,
  width,
}: Params): Graph {
  const points: PointData[] = [];

  const padding = 1;
  const widthWithPadding = width - padding * 2;
  const heightWithPadding = height - padding * 2;

  if (randomize) {
    for (
      let i = 0;
      i < numSamples * oversampleFactor && points.length < numSamples;
      i++
    ) {
      const x = Math.round(Math.random() * widthWithPadding) + padding;
      const y = Math.round(Math.random() * heightWithPadding) + padding;
      const point = { x, y };

      if (isPointInPolygons(point, polygons, polygonStrokeWidth + 2)) continue;

      const nearExistingPoint = points.find((neighborPoint) => {
        const distance = getDistance(point, neighborPoint);
        return distance < randomPointBuffer;
      });

      if (nearExistingPoint) continue;

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

    for (let x = startX; x < widthWithPadding; x += step) {
      for (let y = startY; y < heightWithPadding; y += step) {
        const point = { x, y };

        if (isPointInPolygons(point, polygons, polygonStrokeWidth + 2)) continue;

        points.push(point);
      }
    }
  }

  const graph: Graph = {};
  points.forEach((point) => initializeGraphEntry(graph, point));

  points.forEach((point) => {
    connectPointToGraph({ graph, maxNeighborDistance, maxNeighbors, point, polygons });
  });

  return graph;
}
