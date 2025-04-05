import { Button, HStack, Stack } from "@chakra-ui/react";

import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import getThetaStarPath from "../../utils/getThetaStarPath";
import SimpleCheckbox from "../ui/SimpleCheckbox";

export default function ThetaStarPathPanel() {
	const {
		animatePath,
		graph,
		pathEndPoint,
		pathStartPoint,
		polygons,
		setAppValues,
	} = useAppContext();
	const [busy, setBusy] = useState(false);
	const [checkEndPointLineOfSight, setCheckEndPointLineOfSight] =
		useState(false);

	function handleRunClick() {
		if (!graph) return;

		const pathGenerator = getThetaStarPath({
			checkEndPointLineOfSight,
			endPoint: pathEndPoint,
			graph,
			polygons,
			startPoint: pathStartPoint,
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
			<SimpleCheckbox
				label="Check endpoint line of sight"
				checked={checkEndPointLineOfSight}
				onChange={setCheckEndPointLineOfSight}
			/>
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
