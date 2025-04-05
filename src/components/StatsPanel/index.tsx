import { Button, HStack, Stack, Tabs } from "@chakra-ui/react";
import { AiOutlineBoxPlot } from "react-icons/ai";
import { FaTable } from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import { doTestRun } from "../../utils/testRun";
import PlotPanel from "./PlotPanel";
import TestRunTable from "./TestRunTable";

export default function StatsPanel() {
	const { testRuns, setAppValues } = useAppContext();

	function handleRunClick() {
		setAppValues({
			loading: true,
		});

		setTimeout(() => {
			const numTestRuns = 1;
			const newTestRuns = Array.from({ length: numTestRuns })
				.map(() => doTestRun())
				.filter((testRun) => !!testRun);

			setAppValues({
				...newTestRuns?.[0]?.appValues,
				testRuns: [...(testRuns || []), ...newTestRuns],
				loading: false,
			});
		}, 0);
	}

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<HStack gap={4} justifyContent="space-between">
				<Button onClick={handleRunClick}>Run Test</Button>
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
