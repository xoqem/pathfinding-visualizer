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

  if (randomize) {
    for (let i = 0; i < numSamples; i++) {
      const x = Math.round(Math.random() * width);
      const y = Math.round(Math.random() * height);
      const point = { x, y };
      
      if (isPointInPolygons(point, polygons)) continue;

      points.push(point);
    }
  } else {
    const step = Math.ceil(Math.sqrt((width * height) / numSamples));
    for (let x = Math.round(step / 2); x < width; x += step) {
      for (let y = Math.round(step / 2) ; y < height; y += step) {
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

    sortNeighborsByCost(neighbors).slice(0, maxNeighbors).forEach((neighbor) => {
      addNeighbor({ graph, point, neighbor });
    });
  });

  return graph;
}
