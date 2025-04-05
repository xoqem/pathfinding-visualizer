import { Button, HStack, NativeSelect, Stack, Text } from "@chakra-ui/react";
import startCase from "lodash/startCase";

import { useEffect, useMemo, useState } from "react";
import { TfiTarget } from "react-icons/tfi";
import { useAppContext } from "../../context/AppContext";
import SimpleInput from "../ui/SimpleInput";
import AStarPathPanel from "./AStarPathPanel";

enum AlgorithmType {
	aStar = "aStar",
}

function getNumValue(value: string) {
	const numValue = Number(value);
	return Number.isFinite(numValue) ? numValue : 0;
}

export default function PathPanel() {
	const { clickedPoint, pathEndPoint, pathStartPoint, setAppValues } =
		useAppContext();
	const [listeningForStartPoint, setListeningForStartPoint] = useState(false);
	const [listeningForEndPoint, setListeningForEndPoint] = useState(false);

	const [graphType, setGraphType] = useState<AlgorithmType | null>(
		AlgorithmType.aStar,
	);

	function handleGraphTypeSelectChange(
		event: React.ChangeEvent<HTMLSelectElement>,
	) {
		setGraphType(event.target.value as AlgorithmType);
	}

	function handleEndPointListenClick() {
		setAppValues({ clickedPoint: null });
		setListeningForEndPoint(true);
	}

	function handleStartPointListenClick() {
		setAppValues({ clickedPoint: null });
		setListeningForStartPoint(true);
	}

	useEffect(() => {
		if (!clickedPoint) return;

		const roundedClickedPoint = {
			x: Math.round(clickedPoint.x),
			y: Math.round(clickedPoint.y),
		};

		if (listeningForEndPoint) {
			setAppValues({ pathEndPoint: roundedClickedPoint });
			setListeningForEndPoint(false);
		}

		if (listeningForStartPoint) {
			setAppValues({ pathStartPoint: roundedClickedPoint });
			setListeningForStartPoint(false);
		}
	}, [
		clickedPoint,
		listeningForEndPoint,
		listeningForStartPoint,
		setAppValues,
	]);

	const graphTypePanel = useMemo(() => {
		switch (graphType) {
			case AlgorithmType.aStar:
				return <AStarPathPanel />;
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
		</Stack>
	);
}
