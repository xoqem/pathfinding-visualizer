import type { PointData } from "pixi.js";
import type { AppValues } from "../context/AppContext";
import generateSvgStringWithRandomPolygons from "./generateSvgStringWithRandomPolygons";
import { getDistance } from "./geometry/point";
import getPolygonsFromSvgString from "./getPolygonsFromSvgString";
import getProbabilisticRoadmapGraph from "./graph/getProbabilisticRoadmapGraph";
import getAStarPath from "./path/getAStarPath";
import getBidirectionalAStarPath from "./path/getBidirectionalAStarPath";
import getBreadthFirstPath from "./path/getBreadthFirstSearchPath";
import getDijkstrasPath from "./path/getDijkstrasPath";
import getThetaStarPath from "./path/getThetaStarPath";
import { type Path, getPathDistance } from "./path/path";

function generateTestValues() {
	for (
		let validTestValueTries = 0;
		validTestValueTries < 100;
		validTestValueTries++
	) {
		const width = 1000;
		const height = 1000;

		const svgString = generateSvgStringWithRandomPolygons({
			height,
			maxShapeSize: 100,
			numShapes: 10 + Math.floor(Math.random() * 190),
			width,
		});

		const polygons = getPolygonsFromSvgString({
			height,
			scaleToFit: true,
			svgString,
			width,
		});

		if (!polygons) continue;

		const graphGenerator = getProbabilisticRoadmapGraph({
			height,
			polygons,
			width,
			numSamples: 4000,
			oversampleFactor: 3,
		});

		const graph = Array.from(graphGenerator).pop();

		if (!graph) continue;

		let pathStartPoint: PointData | null = null;
		let pathEndPoint: PointData | null = null;
		for (let validPointTries = 0; validPointTries < 100; validPointTries++) {
			const tempStartPoint = graph.getRandomPointOnGraph();
			const tempEndPoint = graph.getRandomPointOnGraph();

			// if the points are two near each other, try again for a more interesting path
			if (getDistance(tempStartPoint, tempEndPoint) >= width / 2) {
				pathStartPoint = tempStartPoint;
				pathEndPoint = tempEndPoint;
				break;
			}
		}

		if (!pathStartPoint || !pathEndPoint) continue;

		const pathGenerator = getAStarPath({
			graph,
			endPoint: pathEndPoint,
			polygons,
			startPoint: pathStartPoint,
		});
		const optimalPath = Array.from(pathGenerator).pop();
		if (!optimalPath?.points?.length) continue;

		const optimalPathDistance = getPathDistance(optimalPath.points);

		return {
			graph,
			height,
			pathEndPoint,
			pathStartPoint,
			polygons,
			optimalPath,
			optimalPathDistance,
			svgString,
			width,
		};
	}
}

interface PathStats {
	path: Path;
	pathDistance: number;
	pathDistanceRatio: number;
	pathSegments: number;
	percentGraphExplored: number;
	totalTime: number;
}

function getPathStats(
	pathGenerator: Generator<Path>,
	optimalPathDistance: number,
): PathStats | null {
	const startTime = performance.now();

	const path = Array.from(pathGenerator).pop();

	const totalTime = performance.now() - startTime;

	if (!path) return null;

	const pathDistance = getPathDistance(path.points);
	const pathDistanceRatio = pathDistance / optimalPathDistance;

	const graphNodesWithParents = path.graph.nodes.filter((node) => node.parent);
	const percentGraphExplored =
		graphNodesWithParents.length / path.graph.nodes.length;

	return {
		path,
		pathDistance,
		pathDistanceRatio,
		pathSegments: path.points.length - 1,
		percentGraphExplored,
		totalTime,
	};
}

export const algorithms = [
	"breadthFirstSearch",
	"aStar",
	"bidirectionalAStar",
	"dijkstras",
	"thetaStar",
	"thetaStarEndCheck",
] as const;

type Algorithm = (typeof algorithms)[number];

export interface TestRun {
	appValues: Partial<AppValues>;
	pathStatsMap: Map<Algorithm, PathStats | null>;
}

export function doTestRun(): TestRun | null {
	const testValues = generateTestValues();
	if (!testValues) return null;

	const { optimalPath, optimalPathDistance, ...appValues } = testValues;
	const { pathStartPoint, graph, polygons, pathEndPoint } = appValues;

	const pathParams = {
		graph,
		endPoint: pathEndPoint,
		polygons,
		startPoint: pathStartPoint,
	};

	const pathGenerators: { [key: string]: Generator<Path> } = {
		breadthFirstSearch: getBreadthFirstPath(pathParams),
		aStar: getAStarPath(pathParams),
		bidirectionalAStar: getBidirectionalAStarPath(pathParams),
		dijkstras: getDijkstrasPath(pathParams),
		thetaStar: getThetaStarPath({
			...pathParams,
			checkEndPointLineOfSight: false,
		}),
		thetaStarEndCheck: getThetaStarPath({
			...pathParams,
			checkEndPointLineOfSight: true,
		}),
	};

	const pathStatsMap = new Map<Algorithm, PathStats | null>();
	for (const [key, pathGenerator] of Object.entries(pathGenerators)) {
		pathStatsMap.set(
			key as Algorithm,
			getPathStats(pathGenerator, optimalPathDistance),
		);
	}

	return {
		appValues: {
			...appValues,
			path: optimalPath,
			svgFilePath: null,
		},
		pathStatsMap,
	};
}
