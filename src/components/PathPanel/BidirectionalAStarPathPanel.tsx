import { Button, HStack, Stack, Text } from "@chakra-ui/react";

import { useAppContext } from "../../context/AppContext";
import useRunPathGenerator from "../../hooks/useRunPathGenerator";
import getBidirectionalAStarPath from "../../utils/getBidirectionalAStarPath";

export default function BidirectionalAStarPathPanel() {
	const { animatePath, graph, pathEndPoint, pathStartPoint, polygons } =
		useAppContext();
	const { busy, clearPath, runGenerator } = useRunPathGenerator();

	function handleRunClick() {
		if (!graph) return;

		const pathGenerator = getBidirectionalAStarPath({
			animate: animatePath,
			endPoint: pathEndPoint,
			graph,
			polygons,
			startPoint: pathStartPoint,
		});

		runGenerator(pathGenerator);
	}

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<Text>Note: may not find the shortest path</Text>

			<HStack justify="space-between">
				<Button variant="outline" onClick={clearPath}>
					Clear
				</Button>
				<Button onClick={handleRunClick} disabled={busy}>
					Run
				</Button>
			</HStack>
		</Stack>
	);
}
