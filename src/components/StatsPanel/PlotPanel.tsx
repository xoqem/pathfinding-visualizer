import { Box, Stack, Text, VStack, Wrap } from "@chakra-ui/react";
import { startCase } from "lodash";
import Plotly, { type BoxPlotData } from "plotly.js";
import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { algorithms } from "../../utils/testRun";

export default function PlotPanel() {
	const { testRuns } = useAppContext();

	useEffect(() => {
		if (!testRuns) return;

		// const y0 = [];
		// const y1 = [];
		// for (let i = 0; i < 50; i++) {
		// 	y0[i] = Math.random();
		// 	y1[i] = Math.random() + 1;
		// }

		// const trace1 = {
		// 	y: y0,
		// 	type: "box" as const,
		// };

		// const trace2 = {
		// 	y: y1,
		// 	type: "box" as const,
		// };

		// const data: Partial<Plotly.BoxPlotData>[] = [trace1, trace2];

		const pathDistanceRatioPlotData = algorithms.map(
			(algorithm): Partial<BoxPlotData> => {
				const y = testRuns
					.map((run) => run.pathStatsMap.get(algorithm)?.pathDistanceRatio)
					.filter((value): value is number => value !== undefined);

				return {
					y,
					type: "box" as const,
					name: startCase(algorithm),
				};
			},
		);

		Plotly.newPlot("pathDistanceRatioPlot", pathDistanceRatioPlotData);
	}, [testRuns]);

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<Wrap>
				<VStack gap={2}>
					<Text>Path distance ratio</Text>
					<Box id="pathDistanceRatioPlot" width={400} height={400} />
				</VStack>

				<VStack gap={2}>
					<Text>Percent graph explored</Text>
					<Box id="percentGraphExploredPlot" width={400} height={400} />
				</VStack>

				<VStack gap={2}>
					<Text>Time</Text>
					<Box id="pathLengthPlot" width={400} height={400} />
				</VStack>
			</Wrap>
		</Stack>
	);
}
