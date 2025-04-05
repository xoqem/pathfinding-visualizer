import { Button, HStack, Stack } from "@chakra-ui/react";

import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import useRunPathGenerator from "../../hooks/useRunPathGenerator";
import getThetaStarPath from "../../utils/getThetaStarPath";
import SimpleCheckbox from "../ui/SimpleCheckbox";

export default function ThetaStarPathPanel() {
	const { animatePath, graph, pathEndPoint, pathStartPoint, polygons } =
		useAppContext();
	const { busy, clearPath, runGenerator } = useRunPathGenerator();
	const [checkEndPointLineOfSight, setCheckEndPointLineOfSight] =
		useState(false);

	function handleRunClick() {
		if (!graph) return;

		const pathGenerator = getThetaStarPath({
			animate: animatePath,
			checkEndPointLineOfSight,
			endPoint: pathEndPoint,
			graph,
			polygons,
			startPoint: pathStartPoint,
		});

		runGenerator(pathGenerator);
	}

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<SimpleCheckbox
				label="Check endpoint line of sight"
				checked={checkEndPointLineOfSight}
				onChange={setCheckEndPointLineOfSight}
			/>
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
