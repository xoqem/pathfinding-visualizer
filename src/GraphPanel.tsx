import { Stack, Text } from "@chakra-ui/react";

import SimpleSlider from "./SimpleSlider";
import SimpleCheckbox from "./SimpleCheckbox";

interface Props {
  maxNeighborDistance: number;
  setMaxNeighborDistance: (value: number) => void;
  maxNeighbors: number;
  setMaxNeighbors: (value: number) => void;
  numSamples: number;
  setNumSamples: (value: number) => void;
  overSampleFactor: number;
  setOverSampleFactor: (value: number) => void;
  randomize: boolean;
  setRandomize: (value: boolean) => void;
  randomPointBuffer: number;
  setRandomPointBuffer: (value: number) => void;
}

export default function GraphPanel({
  maxNeighborDistance,
  setMaxNeighborDistance,
  maxNeighbors,
  setMaxNeighbors,
  numSamples,
  setNumSamples,
  overSampleFactor,
  setOverSampleFactor,
  randomize,
  setRandomize,
  randomPointBuffer,
  setRandomPointBuffer,
}: Props) {
  

  return (
    <Stack width={200} gap={4} p={2} textAlign="left">
      <Text fontSize="large" textAlign="center">
        Graph
      </Text>

      <SimpleSlider
        label="maxNeighborDistance"
        max={200}
        min={1}
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
        min={2}
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

      {/* <HStack justify="space-between">
        <Button variant="outline" onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button onClick={handleApplyClick}>
          Apply
        </Button>
      </HStack> */}
    </Stack>
  );
}
