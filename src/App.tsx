import { useMemo } from "react";
import { Box } from "@chakra-ui/react";

import useSvgPolygons from "./hooks/useSvgPolygons";
import getProbabilisticRoadmapGraph from "./utils/getProbabilisticRoadmapGraph";
import PixiApp from "./PixiApp";

export default function App() {
  const width = 800;
  const height = 400;

  const { loading, polygons } = useSvgPolygons({
    // filePath: './public/example.svg',
    filePath: './public/maze.svg',
    height,
    scaleToFit: true,
    width,
  });

  const graph = useMemo(() => {
    if (loading) return null;

    return getProbabilisticRoadmapGraph({
      height,
      polygons,
      width,
    });
  }, [height, loading, polygons, width]);

  return (
    <Box
      borderColor="black"
      borderWidth={1}
      height={height + 2}
      width={width + 2}
    >
      <PixiApp
        graph={graph}
        height={height}
        polygons={polygons}
        width={width}
      />
    </Box>
  );
}
