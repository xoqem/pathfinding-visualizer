import { Button, HStack, NativeSelect, Stack, Text } from "@chakra-ui/react";
import { startCase } from "lodash";

import { useMemo, useState } from "react";
import { TfiTarget } from "react-icons/tfi";
import { useAppContext } from "../../context/AppContext";
import { getPathDistance } from "../../utils/path/path";
import SimpleInput from "../ui/SimpleInput";
import AStarPathPanel from "./AStarPathPanel";
import BidirectionalAStarPathPanel from "./BidirectionalAStarPathPanel";
import BreadthFirstSearchPathPanel from "./BreadthFirstSearchPathPanel";
import DijkstrasPathPanel from "./DijkstrasPathPanel";
import ThetaStarPathPanel from "./ThetaStarPathPanel";

enum AlgorithmType {
	aStar = "aStar",
	breadthFirstSearch = "breadthFirstSearch",
	bidirectionalAStar = "bidirectionalAStar",
	dijkstras = "dijkstras",
	thetaStar = "thetaStar",
}

function getNumValue(value: string) {
	const numValue = Number(value);
	return Number.isFinite(numValue) ? numValue : 0;
}

export default function PathPanel() {
	const { path, pathEndPoint, pathStartPoint, setAppValues } = useAppContext();
	const pathDistance = useMemo(
		() => path && getPathDistance(path?.points),
		[path],
	);
	const percentGraphExplored = useMemo(
		() =>
			path
				? path.graph.nodes.filter(({ parent }) => parent).length /
					path.graph.nodes.length
				: 0,
		[path],
	);

	const [graphType, setGraphType] = useState<AlgorithmType | null>(
		AlgorithmType.aStar,
	);

	function handleGraphTypeSelectChange(
		event: React.ChangeEvent<HTMLSelectElement>,
	) {
		setGraphType(event.target.value as AlgorithmType);
	}

	function handleEndPointListenClick() {
		setAppValues({
			onPointClick: (point) =>
				setAppValues({ onPointClick: null, pathEndPoint: point }),
		});
	}

	function handleStartPointListenClick() {
		setAppValues({
			onPointClick: (point) =>
				setAppValues({ onPointClick: null, pathStartPoint: point }),
		});
	}

	const graphTypePanel = useMemo(() => {
		switch (graphType) {
			case AlgorithmType.aStar:
				return <AStarPathPanel />;
			case AlgorithmType.bidirectionalAStar:
				return <BidirectionalAStarPathPanel />;
			case AlgorithmType.breadthFirstSearch:
				return <BreadthFirstSearchPathPanel />;
			case AlgorithmType.dijkstras:
				return <DijkstrasPathPanel />;
			case AlgorithmType.thetaStar:
				return <ThetaStarPathPanel />;
			default:
				return <Text>Select an algorithm.</Text>;
		}
	}, [graphType]);

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<HStack>
				<Text minWidth={90}>Start Point</Text>
				<Button variant="outline" onClick={handleStartPointListenClick}>
					<TfiTarget />
				</Button>
				<SimpleInput
					placeholder="x"
					value={String(pathStartPoint.x)}
					onChange={(value) => {
						setAppValues({
							pathStartPoint: {
								x: getNumValue(value),
								y: pathStartPoint.y,
							},
						});
					}}
				/>
				<SimpleInput
					placeholder="y"
					value={String(pathStartPoint.y)}
					onChange={(value) => {
						setAppValues({
							pathStartPoint: {
								x: pathStartPoint.x,
								y: getNumValue(value),
							},
						});
					}}
				/>
			</HStack>

			<HStack>
				<Text minWidth={90}>End Point</Text>
				<Button variant="outline" onClick={handleEndPointListenClick}>
					<TfiTarget />
				</Button>
				<SimpleInput
					placeholder="x"
					value={String(pathEndPoint.x)}
					onChange={(value) => {
						setAppValues({
							pathEndPoint: {
								x: getNumValue(value),
								y: pathEndPoint.y,
							},
						});
					}}
				/>
				<SimpleInput
					placeholder="y"
					value={String(pathEndPoint.y)}
					onChange={(value) => {
						setAppValues({
							pathEndPoint: {
								x: pathEndPoint.x,
								y: getNumValue(value),
							},
						});
					}}
				/>
			</HStack>

			<NativeSelect.Root>
				<NativeSelect.Field
					onChange={handleGraphTypeSelectChange}
					value={graphType || undefined}
				>
					{Object.values(AlgorithmType).map((value) => (
						<option key={value} value={value}>
							{startCase(value)}
						</option>
					))}
				</NativeSelect.Field>
				<NativeSelect.Indicator />
			</NativeSelect.Root>

			{graphTypePanel}

			{path && (
				<>
					<Text>Path distance: {pathDistance}</Text>
					<Text>
						Path segments: {path.points.length ? path.points.length - 1 : 0}
					</Text>
					<Text>Percent graph explored: {percentGraphExplored}</Text>
				</>
			)}
		</Stack>
	);
}
