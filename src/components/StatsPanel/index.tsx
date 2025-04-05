import { Button, HStack, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import TestRunTable from "./TestRunTable";
import { type TestRun, doTestRun } from "./testRun";

export default function StatsPanel() {
	const { setAppValues } = useAppContext();
	const [testRuns, setTestRuns] = useState<NonNullable<TestRun>[]>([]);

	async function handleRunClick() {
		setAppValues({
			loading: true,
		});

		setTimeout(() => {
			const numTestRuns = 1;
			const newTestRuns = Array.from({ length: numTestRuns })
				.map(() => doTestRun())
				.filter((testRun) => !!testRun);

			setTestRuns((prevTestRuns) => [...prevTestRuns, ...newTestRuns]);

			setAppValues({
				...newTestRuns?.[0]?.appValues,
				loading: false,
			});
		}, 0);
	}

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<HStack gap={4} justifyContent="space-between">
				<Button onClick={handleRunClick}>Run Test</Button>
			</HStack>

			<TestRunTable testRuns={testRuns} />
		</Stack>
	);
}
