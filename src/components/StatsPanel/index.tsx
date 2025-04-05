import {
	Button,
	HStack,
	NumberInput,
	Stack,
	Tabs,
	Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineBoxPlot } from "react-icons/ai";
import { FaTable } from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import {
	type Algorithm,
	type PathStats,
	type TestRun,
	algorithms,
	doTestRun,
} from "../../utils/testRun";
import PlotPanel from "./PlotPanel";
import TestRunTable from "./TestRunTable";

export default function StatsPanel() {
	const { loading, testRuns, setAppValues } = useAppContext();
	const [loadingPercent, setLoadingPercent] = useState<number | null>(null);
	const [numTestToRun, setNumTestToRun] = useState(1);

	function handleRunClick() {
		setAppValues({
			loading: true,
		});
		setLoadingPercent(0);
		const newTestRuns: TestRun[] = [];

		const intervalId = setInterval(() => {
			const testRun = doTestRun();
			if (testRun) {
				newTestRuns.push(testRun);
			}

			setLoadingPercent(newTestRuns.length / numTestToRun);

			if (newTestRuns.length >= numTestToRun) {
				clearInterval(intervalId);
				setLoadingPercent(null);

				setAppValues({
					...newTestRuns?.[0]?.appValues,
					testRuns: [...(testRuns || []), ...newTestRuns],
					loading: false,
				});
			}
		}, 0);
	}

	function handleExportDataClick() {
		if (!testRuns) return;

		const pathStatsMapArray = testRuns.map((testRun) => testRun.pathStatsMap);

		const pathStatsMapArrayWithPath: Partial<
			Record<Algorithm, Omit<PathStats | null, "path">>
		>[] = [];
		for (const pathStatsMap of pathStatsMapArray) {
			const entry: Partial<Record<Algorithm, Omit<PathStats | null, "path">>> =
				{};
			for (const algorithm of algorithms) {
				if (pathStatsMap[algorithm]) {
					const pathStats = pathStatsMap[algorithm];
					const { path, ...pathStatsWithoutPath } = pathStats;
					entry[algorithm] = pathStatsWithoutPath;
				}
			}
			pathStatsMapArrayWithPath.push(entry);
		}

		const fileContents = JSON.stringify(pathStatsMapArrayWithPath, null, 2);
		const blob = new Blob([fileContents], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		const date = new Date();
		const timestamp = date.toISOString().replace(/[:.]/g, "-");
		a.download = `pathStats_${timestamp}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<HStack justifyContent="space-between">
				<HStack gap={4}>
					<Button onClick={handleRunClick} disabled={loading}>
						Run Test
					</Button>
					{!Number.isFinite(loadingPercent) ? (
						<NumberInput.Root
							disabled={loading}
							max={100}
							min={1}
							onValueChange={(e) => setNumTestToRun(Number(e.value))}
							value={String(numTestToRun)}
							width={20}
						>
							<NumberInput.Control />
							<NumberInput.Input />
						</NumberInput.Root>
					) : (
						<Text>
							{((loadingPercent || 0) * 100).toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
							%
						</Text>
					)}
				</HStack>
				<Button onClick={handleExportDataClick} disabled={loading}>
					Export Data
				</Button>
			</HStack>

			<Tabs.Root defaultValue="table">
				<Tabs.List>
					<Tabs.Trigger value="table">
						<FaTable />
						Table
					</Tabs.Trigger>
					<Tabs.Trigger value="plots">
						<AiOutlineBoxPlot />
						Plots
					</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="table">
					<TestRunTable />
				</Tabs.Content>
				<Tabs.Content value="plots">
					<PlotPanel />
				</Tabs.Content>
			</Tabs.Root>
		</Stack>
	);
}
