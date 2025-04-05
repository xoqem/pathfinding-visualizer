import { Button, HStack, Stack } from "@chakra-ui/react";

import { useAppContext } from "../../context/AppContext";
import useRunPathGenerator from "../../hooks/useRunPathGenerator";
import getDijkstrasPath from "../../utils/getDijkstrasPath";

export default function DijkstrasPathPanel() {
	const { animatePath, graph, pathEndPoint, pathStartPoint, polygons } =
		useAppContext();
	const { busy, clearPath, runGenerator } = useRunPathGenerator();

	function handleRunClick() {
		if (!graph) return;

		const pathGenerator = getDijkstrasPath({
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
