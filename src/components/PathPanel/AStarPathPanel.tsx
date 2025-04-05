import { Button, HStack, Stack } from "@chakra-ui/react";

import { useAppContext } from "../../context/AppContext";
import getAStarPath from "../../utils/getAStarPath";

export default function AStarPathPanel() {
	const { graph, height, polygons, width, setAppValues } = useAppContext();

	function handleRunClick() {
		if (!graph) return;

		const startPoint = { x: 5, y: 5 };
		const endPoint = { x: width - 5, y: height - 5 };
		const path = getAStarPath({ endPoint, graph, polygons, startPoint });

		setAppValues({ path });
	}

	function handleClearClick() {
		setAppValues({ path: null });
	}

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<HStack justify="space-between">
				<Button variant="outline" onClick={handleClearClick}>
					Clear
				</Button>
				<Button onClick={handleRunClick}>Run</Button>
			</HStack>
		</Stack>
	);
}
