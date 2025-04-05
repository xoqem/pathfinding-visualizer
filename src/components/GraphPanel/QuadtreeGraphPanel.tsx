import { Button, HStack, Stack } from "@chakra-ui/react";

import { startCase } from "lodash";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import getQuadtreeGraph from "../../utils/getQuadtreeGraph";
import SimpleSlider from "../ui/SimpleSlider";

export default function QuadtreeGraphPanel() {
	const {
		animateGraph,
		height,
		width,
		polygons,
		polygonStrokeWidth,
		setAppValues,
	} = useAppContext();
	const [maxSize, setMaxSize] = useState(100);
	const [minSize, setMinSize] = useState(10);
	const [busy, setBusy] = useState(false);

	function handleApplyClick() {
		setAppValues({ overlayPolygons: null, path: null });

		const graphGenerator = getQuadtreeGraph({
			height,
			maxSize,
			minSize,
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
		setAppValues({ graph: null });
	}

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<SimpleSlider
				label={startCase("minSize")}
				max={100}
				min={5}
				onChange={setMinSize}
				value={minSize}
			/>

			<SimpleSlider
				label={startCase("maxSize")}
				max={200}
				min={20}
				onChange={setMaxSize}
				value={maxSize}
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
