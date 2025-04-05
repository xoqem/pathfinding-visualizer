import { useMemo, useState } from "react";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";

import useSvgPolygons from "./hooks/useSvgPolygons";
import getProbabilisticRoadmapGraph from "./utils/getProbabilisticRoadmapGraph";
import PixiApp from "./PixiApp";
import SimpleSlider from "./SimpleSlider";
import SimpleCheckbox from "./SimpleCheckbox";

export default function App() {
  const width = 800;
  const height = 400;

  const [maxNeighborDistance, setMaxNeighborDistance] = useState(100);
  const [maxNeighbors, setMaxNeighbors] = useState(8);
  const [numSamples, setNumSamples] = useState(400);
  const [overSampleFactor, setOverSampleFactor] = useState(2);
  const [randomize, setRandomize] = useState(true);
  const [randomPointBuffer, setRandomPointBuffer] = useState(10);

  const { loading, polygons } = useSvgPolygons({
    filePath: './public/example.svg',
    // filePath: "./public/maze.svg",
    height,
    scaleToFit: true,
    width,
  });

  const graph = useMemo(() => {
    if (loading) return null;

    return getProbabilisticRoadmapGraph({
      height,
      maxNeighborDistance,
      maxNeighbors,
      numSamples,
      overSampleFactor,
      polygons,
      randomize,
      randomPointBuffer,
      width,
    });
  }, [
    height,
    loading,
    maxNeighborDistance,
    maxNeighbors,
    numSamples,
    overSampleFactor,
    polygons,
    randomize,
    randomPointBuffer,
    width,
  ]);

  return (
    <Flex columnGap={4}>
      <Box
        // borderColor="black"
        borderRadius={4}
        borderWidth={1}
        height={height + 2}
        minHeight={height + 2}
        minWidth={width + 2}
        overflow="hidden"
        width={width + 2}
      >
        <PixiApp
          graph={graph}
          height={height}
          polygons={polygons}
          width={width}
        />
      </Box>
      <Box borderRadius={4} borderWidth={1} overflow="scroll" width={200}>
        <Stack width="200px" gap="4" p={2} textAlign="left">
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
        </Stack>
      </Box>
    </Flex>
  );
}
