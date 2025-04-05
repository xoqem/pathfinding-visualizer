import { HStack, NativeSelect, Stack, Text } from "@chakra-ui/react";
import startCase from "lodash/startCase";

import { useMemo, useState } from "react";
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
	const { pathEndPoint, pathStartPoint, setAppValues } = useAppContext();

	const [graphType, setGraphType] = useState<AlgorithmType | null>(
		AlgorithmType.aStar,
	);

	function handleGraphTypeSelectChange(
		event: React.ChangeEvent<HTMLSelectElement>,
	) {
		setGraphType(event.target.value as AlgorithmType);
	}

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
