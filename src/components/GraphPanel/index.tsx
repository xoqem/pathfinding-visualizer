import { NativeSelect, Stack, Text } from "@chakra-ui/react";
import startCase from "lodash/startCase";

import { useMemo, useState } from "react";
import ProbabilisticRoadmapGraphPanel from "./ProbabilisticRoadmapGraphPanel";

enum GraphType {
	probabilisticRoadmap = "probabilisticRoadmap",
}

export default function GraphPanel() {
	const [graphType, setGraphType] = useState<GraphType | null>(
		GraphType.probabilisticRoadmap,
	);

	function handleGraphTypeSelectChange(
		event: React.ChangeEvent<HTMLSelectElement>,
	) {
		setGraphType(event.target.value as GraphType);
	}

	const graphTypePanel = useMemo(() => {
		switch (graphType) {
			case GraphType.probabilisticRoadmap:
				return <ProbabilisticRoadmapGraphPanel />;
			default:
				return <Text>Select a graph type.</Text>;
		}
	}, [graphType]);

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<NativeSelect.Root>
				<NativeSelect.Field
					onChange={handleGraphTypeSelectChange}
					value={graphType || undefined}
				>
					{Object.values(GraphType).map((value) => (
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
