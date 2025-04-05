import { Button, Stack, Table } from "@chakra-ui/react";
import type { Polygon } from "pixi.js";
import { useAppContext } from "../context/AppContext";
import generateSvgStringWithRandomPolygons from "../utils/generateSvgStringWithRandomPolygons";
import getAStarPath from "../utils/getAStarPath";
import getPolygonsFromSvgString from "../utils/getPolygonsFromSvgString";
import getProbabilisticRoadmapGraph from "../utils/getProbabilisticRoadmapGraph";
import type Graph from "../utils/graph";
import isPointInPolygons from "../utils/isPointInPolygons";
import { getPathDistance } from "../utils/path";

function getClearPoint(polygons: Polygon[], width: number, height: number) {
	let i = 0;
	while (i < 100) {
		i++;

		const point = {
			x: Math.floor(Math.random() * width),
			y: Math.floor(Math.random() * height),
		};

		if (!isPointInPolygons(point, polygons, 1)) {
			return point;
		}
	}
}

function getRandomPointOnGraph(graph: Graph) {
	const points = graph.points;
	const randomIndex = Math.floor(Math.random() * points.length);
	return points[randomIndex];
}

function furthestTwoPointsOnGraph(graph: Graph) {
	const points = graph.points;
	let maxDistance = 0;
	let pointA = null;
	let pointB = null;
	for (let i = 0; i < points.length; i++) {
		for (let j = i + 1; j < points.length; j++) {
			const distance = getPathDistance([points[i], points[j]]);
			if (distance > maxDistance) {
				maxDistance = distance;
				pointA = points[i];
				pointB = points[j];
			}
		}
	}
	return { pointA, pointB };
}

function generateTestAppValues() {
	for (let i = 0; i < 100; i++) {
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

		const pathStartPoint = getRandomPointOnGraph(graph);
		if (!pathStartPoint) continue;

		const pathEndPoint = getRandomPointOnGraph(graph);
		if (!pathEndPoint) continue;

		const pathGenerator = getAStarPath({
			graph,
			endPoint: pathEndPoint,
			polygons,
			startPoint: pathStartPoint,
		});
		const path = Array.from(pathGenerator).pop();
		if (!path?.points?.length) continue;

		return {
			graph,
			height,
			pathEndPoint,
			pathStartPoint,
			polygons,
			svgString,
			width,
		};
	}
}

function doTestRun() {
	const appValues = generateTestAppValues();
	if (!appValues) return;

	const { pathStartPoint, graph, polygons, pathEndPoint } = appValues;

	const startTime = performance.now();

	const pathGenerator = getAStarPath({
		graph,
		endPoint: pathEndPoint,
		polygons,
		startPoint: pathStartPoint,
	});

	const path = Array.from(pathGenerator).pop();

	const totalTime = performance.now() - startTime;

	if (!path) return;

	const pathDistance = getPathDistance(path.points);

	return {
		appValues: {
			...appValues,
			path,
			svgFilePath: null,
		},
		pathDistance,
		totalTime,
	};
}

export default function StatsPanel() {
	const { setAppValues } = useAppContext();

	function handleRunClick() {
		const testResult = doTestRun();
		if (!testResult) return;

		const { appValues, pathDistance, totalTime } = testResult;

		setAppValues(appValues);
	}

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<Button onClick={handleRunClick}>Run Test</Button>

			<Table.Root variant="outline">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>Col1</Table.ColumnHeader>
						<Table.ColumnHeader>Col2</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell>Value 1</Table.Cell>
						<Table.Cell>Value 2</Table.Cell>
					</Table.Row>
				</Table.Body>
				<Table.Footer>
					<Table.Row>
						<Table.Cell>Value 3</Table.Cell>
						<Table.Cell>Value 4</Table.Cell>
					</Table.Row>
				</Table.Footer>
			</Table.Root>
		</Stack>
	);
}
