import { Button, HStack, Stack } from "@chakra-ui/react";

import { startCase } from "lodash";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import getProbabilisticRoadmapGraph from "../../utils/getProbabilisticRoadmapGraph";
import SimpleCheckbox from "../ui/SimpleCheckbox";
import SimpleSlider from "../ui/SimpleSlider";

export default function ProbabilisticRoadmapGraphPanel() {
	const {
		animateGraph,
		height,
		width,
		polygons,
		polygonStrokeWidth,
		setAppValues,
	} = useAppContext();
	const [maxNeighborDistance, setMaxNeighborDistance] = useState(100);
	const [maxNeighbors, setMaxNeighbors] = useState(8);
	const [numSamples, setNumSamples] = useState(400);
	const [oversampleFactor, setOversample] = useState(2);
	const [randomize, setRandomize] = useState(true);
	const [randomPointBuffer, setRandomPointBuffer] = useState(10);
	const [busy, setBusy] = useState(false);

	function handleApplyClick() {
		setAppValues({ overlayPolygons: null, path: null });

		const graphGenerator = getProbabilisticRoadmapGraph({
			height,
			maxNeighborDistance,
			maxNeighbors,
			numSamples,
			oversampleFactor,
			polygons,
			polygonStrokeWidth,
			randomize,
			randomPointBuffer,
			width,
		});

		if (animateGraph) {
			setBusy(true);

			const intervalId = setInterval(() => {
				const graph = graphGenerator.next().value;

				if (graph === undefined) {
					clearInterval(intervalId);
					setBusy(false);
					return;
				}

				setAppValues({ graph: graph.clone() });
			}, 0);
		} else {
			const graph = Array.from(graphGenerator).pop();
			setAppValues({ graph });
		}
	}

	function handleClearClick() {
		setAppValues({ graph: null, overlayPolygons: null });
	}

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<SimpleSlider
				label={startCase("maxNeighborDistance")}
				max={300}
				min={10}
				onChange={setMaxNeighborDistance}
				value={maxNeighborDistance}
			/>

			<SimpleSlider
				label={startCase("maxNeighbors")}
				max={10}
				min={1}
				onChange={setMaxNeighbors}
				value={maxNeighbors}
			/>

			<SimpleSlider
				label={startCase("numSamples")}
				max={4000}
				min={10}
				onChange={setNumSamples}
				value={numSamples}
			/>

			<SimpleSlider
				label={startCase("oversampleFactor")}
				onChange={setOversample}
				max={3}
				min={1}
				step={0.1}
				value={oversampleFactor}
			/>

			<SimpleCheckbox
				label={startCase("randomize")}
				checked={randomize}
				onChange={setRandomize}
			/>

			<SimpleSlider
				disabled={!randomize}
				label={startCase("randomPointBuffer")}
				onChange={setRandomPointBuffer}
				max={50}
				min={1}
				value={randomPointBuffer}
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
