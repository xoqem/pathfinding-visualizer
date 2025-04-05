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
import { type TestRun, doTestRun } from "../../utils/testRun";
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

	return (
		<Stack gap={4} padding={2} textAlign="left">
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
