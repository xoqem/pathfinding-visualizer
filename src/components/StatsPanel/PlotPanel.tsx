import { Stack } from "@chakra-ui/react";
import { useAppContext } from "../../context/AppContext";

export default function PlotPanel() {
	const { testRuns } = useAppContext();

	return (
		<Stack gap={4} padding={2} textAlign="left">
			{testRuns?.length}
		</Stack>
	);
}
