import { Button, HStack, Stack } from "@chakra-ui/react";

import { startCase } from "lodash";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import getGridGraph from "../../utils/graph/getGridGraph";
import SimpleCheckbox from "../ui/SimpleCheckbox";
import SimpleSlider from "../ui/SimpleSlider";

export default function GridGraphPanel() {
	const {
		animateGraph,
		height,
		width,
		polygons,
		polygonStrokeWidth,
		setAppValues,
	} = useAppContext();
	const [gridSize, setGridSize] = useState(20);
	const [allowDiagonal, setAllowDiagonal] = useState(false);
	const [busy, setBusy] = useState(false);

	function handleApplyClick() {
		setAppValues({ overlayPolygons: null, path: null });

		const graphGenerator = getGridGraph({
			allowDiagonal,
			gridSize,
			height,
			polygons,
			polygonStrokeWidth,
			width,
		});

		if (animateGraph) {
			setBusy(true);

			const intervalId = setInterval(() => {
				const { graph, overlayPolygons } = graphGenerator.next().value || {};

				if (graph === undefined) {
					clearInterval(intervalId);
					setBusy(false);
					return;
				}

				setAppValues({
					graph: graph.clone(),
					overlayPolygons: [...overlayPolygons],
				});
			}, 0);
		} else {
			const { graph, overlayPolygons } = Array.from(graphGenerator).pop() || {};
			setAppValues({ graph, overlayPolygons });
		}
	}

	function handleClearClick() {
		setAppValues({ graph: null, overlayPolygons: null });
	}

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<SimpleSlider
				label={startCase("gridSize")}
				max={100}
				min={10}
				onChange={setGridSize}
				value={gridSize}
			/>

			<SimpleCheckbox
				label={startCase("allowDiagonal")}
				checked={allowDiagonal}
				onChange={setAllowDiagonal}
			/>

			<HStack justify="space-between">
				<Button variant="outline" onClick={handleClearClick} disabled={busy}>
					Clear
				</Button>
				<Button onClick={handleApplyClick} disabled={busy}>
					Apply
				</Button>
			</HStack>
		</Stack>
	);
}
