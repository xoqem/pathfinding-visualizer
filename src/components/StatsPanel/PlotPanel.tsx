import { Box, Button, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { startCase } from "lodash";
import Plotly, { type BoxPlotData } from "plotly.js";
import { useCallback, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { algorithms } from "../../utils/testRun";

const stats = [
	"pathDistanceRatio",
	"percentGraphExplored",
	"totalTime",
] as const;

type Stat = (typeof stats)[number];

const yAxisLabels: Record<Stat, string> = {
	pathDistanceRatio: "Ratio to Shortest Path",
	percentGraphExplored: "Graph Explored %",
	totalTime: "Time (ms)",
};

export default function PlotPanel() {
	const { testRuns } = useAppContext();

	const drawPlots = useCallback(() => {
		if (!testRuns) return;

		for (const stat of stats) {
			const pathDistanceRatioPlotData = algorithms.map(
				(algorithm): Partial<BoxPlotData> => {
					const y = testRuns
						.map((run) => run.pathStatsMap.get(algorithm)?.[stat])
						.filter((value): value is number => value !== undefined);

					return {
						y,
						type: "box" as const,
						name: startCase(algorithm),
						showlegend: false,
						hoverinfo: "y",
					};
				},
			);

			Plotly.newPlot(`${stat}Plot`, pathDistanceRatioPlotData, {
				yaxis: {
					tickmode: "auto",
					nticks: 10,
					title: {
						text: yAxisLabels[stat],
					},
				},
				margin: {
					t: 50,
					b: 50,
					r: 50,
				},
			});
		}
	}, [testRuns]);

	useEffect(() => {
		drawPlots();
	}, [drawPlots]);

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<HStack gap={4}>
				<Button onClick={drawPlots}>Refresh</Button>
			</HStack>
			<VStack gap={4}>
				{stats.map((stat) => (
					<VStack key={stat} gap={2}>
						<Text>{startCase(stat)}</Text>
						<Box id={`${stat}Plot`} width={1000} height={400} />
					</VStack>
				))}
			</VStack>
		</Stack>
	);
}
