import { PointData } from "pixi.js";

import { addNeighbor, getGraphValue, Graph, isPointInNeighbors } from "./graph";
import isPointInPolygons from "./isPointInPolygons";
import { arePointsEqual } from "./point";

interface Params {
  height: number;
  polygons: PointData[][] | null;
  width: number;
}


export default function getProbabilisticRoadmapGraph({
  height,
  polygons,
  width,
}: Params): Graph {
  // generate random points, discarding any that are inside the polygons
  const points: PointData[] = [];
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const point = { x, y };
    
    if (isPointInPolygons(point, polygons)) continue;

    points.push(point);
  }

  const graph: Graph = {};

  points.forEach((point) => {
    const { neighbors } = getGraphValue(graph, point);

    points.forEach((otherPoint) => {
      if (arePointsEqual(point, otherPoint)) return;
      
      if (isPointInNeighbors(otherPoint, neighbors)) return;
      
      addNeighbor(graph, point, otherPoint);
    });
  });

  points.forEach((point) => {
    const graphValue = getGraphValue(graph, point);
    graphValue.neighbors = graphValue.neighbors.sort(({ cost: costA }, {cost: costB }) => costA - costB).slice(0, 5);
  });

  console.log('>>>', 'graph', graph);
  return graph;
}
