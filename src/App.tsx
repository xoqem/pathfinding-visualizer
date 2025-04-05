import { useMemo } from "react";
import { Box } from "@chakra-ui/react";

import useSvgPolygons from "./hooks/useSvgPolygons";
import getProbabilisticRoadmapGraph from "./utils/getProbabilisticRoadmapGraph";
import PixiApp from "./PixiApp";

export default function App() {
  const { loading, polygons } = useSvgPolygons("./public/example.svg");
  const mapWidth = 800;
  const mapHeight = 400;

  const graph = useMemo(() => {
    if (loading) return null;

    return getProbabilisticRoadmapGraph({
      height: mapHeight,
      polygons,
      width: mapWidth,
    });
  }, [mapHeight, loading, polygons, mapWidth]);

  return (
    <Box
      borderColor="black"
      borderWidth={1}
      height={mapHeight + 2}
      width={mapWidth + 2}
    >
      <PixiApp
        graph={graph}
        height={mapHeight}
        polygons={polygons}
        width={mapWidth}
      />
    </Box>
  );
}
