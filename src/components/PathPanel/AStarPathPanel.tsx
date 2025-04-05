import { Button, HStack, Stack } from "@chakra-ui/react";

import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import getAStarPath from "../../utils/getAStarPath";

export default function AStarPathPanel() {
	const { animatePath, graph, height, polygons, width, setAppValues } =
		useAppContext();
	const [busy, setBusy] = useState(false);

	function handleRunClick() {
		if (!graph) return;

		const startPoint = { x: 5, y: 5 };
		const endPoint = { x: width - 5, y: height - 5 };
		const pathGenerator = getAStarPath({
			endPoint,
			graph,
			polygons,
			startPoint,
		});

		if (animatePath) {
			setBusy(true);

			const intervalId = setInterval(() => {
				const path = pathGenerator.next().value;

				if (path === undefined) {
					clearInterval(intervalId);
					setBusy(false);
					return;
				}

				setAppValues({
					path: {
						...path,
					},
				});
			}, 0);
		} else {
			const path = Array.from(pathGenerator).pop();
			setAppValues({ path });
		}
	}

	function handleClearClick() {
		setAppValues({ path: null });
	}

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<HStack justify="space-between">
				<Button variant="outline" onClick={handleClearClick} disabled={busy}>
					Clear
				</Button>
				<Button onClick={handleRunClick} disabled={busy}>
					Run
				</Button>
			</HStack>
		</Stack>
	);
}
