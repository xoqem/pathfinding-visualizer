import {
	Box,
	Button,
	HStack,
	Stack,
	Table,
	Text,
	VStack,
} from "@chakra-ui/react";
import { startCase } from "lodash";
import * as math from "mathjs";
import Plotly, { type BoxPlotData } from "plotly.js";
import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { type Algorithm, algorithms } from "../../utils/testRun";

const stats = [
	"pathDistanceRatio",
	"percentGraphExplored",
	"totalTime",
] as const;

type Stat = (typeof stats)[number];

type StatData = Partial<
	Record<
		Algorithm,
		Partial<{
			y: number[];
			mean: number;
			median: number;
			std: number;
			min: number;
			max: number;
			q1: number;
			q3: number;
		}>
	>
>;

type StatsData = Partial<Record<Stat, StatData>>;

const yAxisLabels: Record<Stat, string> = {
	pathDistanceRatio: "Ratio to Shortest Path",
	percentGraphExplored: "Graph Explored %",
	totalTime: "Time (ms)",
};

const columnKeys = ["mean", "median", "std", "min", "max", "q1", "q3"] as const;

export default function PlotPanel() {
	const { testRuns } = useAppContext();
	const [statsData, setStatsData] = useState<StatsData | null>(null);

	const drawPlots = useCallback(() => {
		if (!testRuns) return;

		const newStatsData: StatsData = {};

		for (const stat of stats) {
			const dataForStat: StatData = {};
			newStatsData[stat] = dataForStat;

			const pathDistanceRatioPlotData = algorithms.map(
				(algorithm): Partial<BoxPlotData> => {
					const y = testRuns
						.map((run) => run.pathStatsMap.get(algorithm)?.[stat])
						.filter((value): value is number => value !== undefined);

					dataForStat[algorithm] = {
						y,
						mean: math.mean(y),
						median: math.median(y),
						std: math.std(y),
						min: math.min(y),
						max: math.max(y),
						q1: math.quantileSeq(y, 0.25),
						q3: math.quantileSeq(y, 0.75),
					};

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

			setStatsData(newStatsData);
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
								{algorithms.map((algorithm) => (
									<Table.Row key={`${algorithm}`}>
										<Table.Cell>{startCase(algorithm)}</Table.Cell>
										{columnKeys.map((columnKey) => (
											<Table.Cell key={columnKey}>
												{statsData?.[stat]?.[algorithm]?.[columnKey] ?? "—"}
											</Table.Cell>
										))}
									</Table.Row>
								))}
							</Table.Body>
						</Table.Root>
					</VStack>
				))}
			</VStack>
		</Stack>
	);
}
