import { useMemo, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";

import useSvgPolygons from "./hooks/useSvgPolygons";
import getProbabilisticRoadmapGraph from "./utils/getProbabilisticRoadmapGraph";
import PixiApp from "./PixiApp";
import GraphPanel from "./GraphPanel";

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
        borderRadius="sm"
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
      <Box borderRadius="sm" borderWidth={1} overflow="scroll" width={200}>
        <GraphPanel
          maxNeighborDistance={maxNeighborDistance}
          setMaxNeighborDistance={setMaxNeighborDistance}
          maxNeighbors={maxNeighbors}
          setMaxNeighbors={setMaxNeighbors}
          numSamples={numSamples}
          setNumSamples={setNumSamples}
          overSampleFactor={overSampleFactor}
          setOverSampleFactor={setOverSampleFactor}
          randomize={randomize}
          setRandomize={setRandomize}
          randomPointBuffer={randomPointBuffer}
          setRandomPointBuffer={setRandomPointBuffer}
        />
      </Box>
    </Flex>
  );
}
