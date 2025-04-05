import {
	Button,
	ButtonGroup,
	HStack,
	IconButton,
	Pagination,
	Stack,
	Table,
} from "@chakra-ui/react";
import { set, startCase } from "lodash";
import type { PointData, Polygon } from "pixi.js";
import { useMemo, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useAppContext } from "../context/AppContext";
import generateSvgStringWithRandomPolygons from "../utils/generateSvgStringWithRandomPolygons";
import getAStarPath from "../utils/getAStarPath";
import getBidirectionalAStarPath from "../utils/getBidirectionalAStarPath";
import getBreadthFirstPath from "../utils/getBreadthFirstSearchPath";
import getDijkstrasPath from "../utils/getDijkstrasPath";
import getPolygonsFromSvgString from "../utils/getPolygonsFromSvgString";
import getProbabilisticRoadmapGraph from "../utils/getProbabilisticRoadmapGraph";
import getThetaStarPath from "../utils/getThetaStarPath";
import type Graph from "../utils/graph";
import isPointInPolygons from "../utils/isPointInPolygons";
import { type Path, getPathDistance } from "../utils/path";
import { getDistance } from "../utils/point";

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
			const tempStartPoint = getRandomPointOnGraph(graph);
			const tempEndPoint = getRandomPointOnGraph(graph);

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

function getPathStats(
	pathGenerator: Generator<Path>,
	optimalPathDistance: number,
) {
	const startTime = performance.now();

	const path = Array.from(pathGenerator).pop();

	const totalTime = performance.now() - startTime;

	if (!path) return;

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

type PathStats = ReturnType<typeof getPathStats>;
type TestRun = ReturnType<typeof doTestRun>;

function doTestRun() {
	const testValues = generateTestValues();
	if (!testValues) return;

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

	const pathStatsMap = new Map<string, PathStats>();
	for (const [key, pathGenerator] of Object.entries(pathGenerators)) {
		pathStatsMap.set(key, getPathStats(pathGenerator, optimalPathDistance));
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

const columnKeys = [
	"pathDistance",
	"pathDistanceRatio",
	"pathSegments",
	"percentGraphExplored",
	"totalTime",
] as const;

export default function StatsPanel() {
	const { setAppValues } = useAppContext();
	const [testRuns, setTestRuns] = useState<NonNullable<TestRun>[]>([]);
	const [page, setPage] = useState(1);
	const visibleTestRun = useMemo(() => testRuns[page - 1], [page, testRuns]);
	const pathStatsMapEntries = useMemo(
		() => Array.from(visibleTestRun?.pathStatsMap.entries() || []),
		[visibleTestRun],
	);

	async function handleRunClick() {
		setAppValues({
			loading: true,
		});

		setTimeout(() => {
			const numTestRuns = 1;
			const newTestRuns = Array.from({ length: numTestRuns })
				.map(() => doTestRun())
				.filter((testRun) => !!testRun);

			setTestRuns((prevTestRuns) => [...prevTestRuns, ...newTestRuns]);

			setAppValues({
				...newTestRuns?.[0]?.appValues,
				loading: false,
			});
		}, 0);
	}

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<HStack gap={4} justifyContent="space-between">
				<Button onClick={handleRunClick}>Run Test</Button>
				{!!testRuns.length && (
					<Pagination.Root
						count={testRuns.length}
						pageSize={1}
						page={page}
						onPageChange={(e) => setPage(e.page)}
					>
						<ButtonGroup variant="ghost" size="sm">
							<Pagination.PrevTrigger asChild>
								<IconButton>
									<HiChevronLeft />
								</IconButton>
							</Pagination.PrevTrigger>

							<Pagination.Items
								render={(page) => (
									<IconButton variant={{ base: "ghost", _selected: "outline" }}>
										{page.value}
									</IconButton>
								)}
							/>

							<Pagination.NextTrigger asChild>
								<IconButton>
									<HiChevronRight />
								</IconButton>
							</Pagination.NextTrigger>
						</ButtonGroup>
					</Pagination.Root>
				)}
			</HStack>

			<Table.Root variant="outline">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>Algorithm</Table.ColumnHeader>
						{columnKeys.map((columnKey) => (
							<Table.ColumnHeader key={columnKey}>
								{startCase(columnKey)}
							</Table.ColumnHeader>
						))}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{pathStatsMapEntries.map(([key, pathStats]) => (
						<Table.Row key={`${key}`}>
							<Table.Cell>
								<Button
									variant="outline"
									size="xs"
									onClick={() =>
										setAppValues({
											...visibleTestRun.appValues,
											path: pathStats?.path,
										})
									}
								>
									{startCase(key)}
								</Button>
							</Table.Cell>
							{columnKeys.map((columnKey) => (
								<Table.Cell key={columnKey}>
									{pathStats?.[columnKey] ?? "—"}
								</Table.Cell>
							))}
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</Stack>
	);
}
