import { PointData, Polygon } from "pixi.js";
import { connectPointToGraph, getGraphKey, getGraphValue, Graph, GraphNode } from "./graph";
import { Path } from "./path";

function heuristic(a: PointData, b: PointData): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

interface Params {
  end: PointData;
  graph: Graph;
  polygons: Polygon[] | null;
  start: PointData;
}

export default function getAStarPath({end, graph, polygons, start}: Params): Path {
  const pathGraph = JSON.parse(JSON.stringify(graph)) as Graph;

  connectPointToGraph({ graph: pathGraph, maxNeighbors: 8, point: start, polygons });
  connectPointToGraph({ graph: pathGraph, maxNeighbors: 8, point: end, polygons });

  const path: Path = {
    end,
    graph: pathGraph,
    points: [],
    start,
  };

  const startKey = getGraphKey(start);
  const endKey = getGraphKey(end);

  const openSet: Set<string> = new Set([startKey]);
  const gScore: { [key: string]: number } = {};
  const fScore: { [key: string]: number } = {};

  gScore[startKey] = 0;
  fScore[startKey] = heuristic(start, end);

  while (openSet.size > 0) {
    let currentKey: string | null = null;
    let lowestFScore = Infinity;

    for (const key of openSet) {
      if (fScore[key] !== undefined && fScore[key] < lowestFScore) {
        lowestFScore = fScore[key];
        currentKey = key;
      }
    }

    if (currentKey === endKey) {
      let node: GraphNode | null = getGraphValue(pathGraph, end);
      while (node.parent) {
        path.points.push(node.point);
        node = getGraphValue(pathGraph, node.parent.point);
      }

      path.points.reverse();

      // we're done, so break out of the main while loop
      break;
    }

    openSet.delete(currentKey!);

    const currentNode = pathGraph[currentKey!];
    for (const neighbor of currentNode.neighbors) {
      const neighborKey = getGraphKey(neighbor.point);
      const tentativeGScore = gScore[currentKey!] + neighbor.cost;

      if (tentativeGScore < (gScore[neighborKey] || Infinity)) {
        gScore[neighborKey] = tentativeGScore;
        fScore[neighborKey] = tentativeGScore + heuristic(neighbor.point, end);

        if (!openSet.has(neighborKey)) {
          openSet.add(neighborKey);
        }

        if (neighborKey !== startKey) {
          pathGraph[neighborKey].parent = {
            point: currentNode.point,
            cost: neighbor.cost,
          };
        }
      }
    }
  }

  return path;
}