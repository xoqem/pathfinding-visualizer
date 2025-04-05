import { Button, HStack, Stack, Text } from "@chakra-ui/react";

import { useAppContext } from "../../context/AppContext";
import useRunPathGenerator from "../../hooks/useRunPathGenerator";
import getBreadthFirstPath from "../../utils/path/getBreadthFirstSearchPath";

export default function BreadthFirstSearchPathPanel() {
	const { animatePath, graph, pathEndPoint, pathStartPoint, polygons } =
		useAppContext();
	const { busy, clearPath, runGenerator } = useRunPathGenerator();

	function handleRunClick() {
		if (!graph) return;

		const pathGenerator = getBreadthFirstPath({
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
			<Text>
				Note: breadth first search may not find the shortest path if all edges
				are not equal length.
			</Text>

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
