import { Button, HStack, Stack } from "@chakra-ui/react";

import SimpleSlider from "../ui/SimpleSlider";
import SimpleCheckbox from "../ui/SimpleCheckbox";
import { useState } from "react";
import getProbabilisticRoadmapGraph from "../../utils/getProbabilisticRoadmapGraph";
import { useAppContext } from "../../context/AppContext";

export default function ProbabilisticRoadmapGraphPanel() {
  const { height, width, polygons, polygonStrokeWidth, setAppValues } = useAppContext();
  const [maxNeighborDistance, setMaxNeighborDistance] = useState(100);
  const [maxNeighbors, setMaxNeighbors] = useState(8);
  const [numSamples, setNumSamples] = useState(400);
  const [overSampleFactor, setOverSampleFactor] = useState(2);
  const [randomize, setRandomize] = useState(true);
  const [randomPointBuffer, setRandomPointBuffer] = useState(10);

  function handleApplyClick() {
    const graph = getProbabilisticRoadmapGraph({
      height,
      maxNeighborDistance,
      maxNeighbors,
      numSamples,
      overSampleFactor,
      polygons,
      polygonStrokeWidth,
      randomize,
      randomPointBuffer,
      width,
    });

    setAppValues({ graph });
  }

  function handleClearClick() {
    setAppValues({ graph: null });
  }

  return (
    <Stack gap={4} padding={2} textAlign="left">
      <SimpleSlider
        label="maxNeighborDistance"
        max={300}
        min={10}
        onChange={setMaxNeighborDistance}
        value={maxNeighborDistance}
      />

      <SimpleSlider
        label="maxNeighbors"
        max={10}
        min={1}
        onChange={setMaxNeighbors}
        value={maxNeighbors}
      />

      <SimpleSlider
        label="numSamples"
        max={4000}
        min={10}
        onChange={setNumSamples}
        value={numSamples}
      />

      <SimpleSlider
        label="overSampleFactor"
        onChange={setOverSampleFactor}
        max={3}
        min={1}
        step={0.1}
        value={overSampleFactor}
      />

      <SimpleCheckbox
        label="randomize"
        checked={randomize}
        onChange={setRandomize}
      />

      <SimpleSlider
        disabled={!randomize}
        label="randomPointBuffer"
        onChange={setRandomPointBuffer}
        max={50}
        min={1}
        value={randomPointBuffer}
      />

      <HStack justify="space-between">
        <Button variant="outline" onClick={handleClearClick}>
          Clear
        </Button>
        <Button onClick={handleApplyClick}>Apply</Button>
      </HStack>
    </Stack>
  );
}
