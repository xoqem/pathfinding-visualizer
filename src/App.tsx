import { Box, Center, Flex, Spinner } from "@chakra-ui/react";

import useSvgPolygons from "./hooks/useSvgPolygons";
import PixiApp from "./PixiApp";
import GraphPanel from "./GraphPanel";
import { useAppContext } from "./context/AppContext";

export default function App() {
  const { graph, height, polygons, width } = useAppContext();

  const { loading } = useSvgPolygons({
    filePath: "./example.svg",
    // filePath: "./maze.svg",
    height,
    scaleToFit: true,
    width,
  });

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
        {loading ? (
          <Center height="100%" width="100%">
            <Spinner />
          </Center>
        ) : (
          <PixiApp
            graph={graph}
            height={height}
            polygons={polygons}
            width={width}
          />
        )}
      </Box>
      <Box borderRadius="sm" borderWidth={1} width={200}>
        <GraphPanel />
      </Box>
    </Flex>
  );
}
