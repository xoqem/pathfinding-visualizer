import { Box, Center, Flex, Spinner } from "@chakra-ui/react";

import PixiApp from "./PixiApp";
import GraphPanel from "./GraphPanel";
import { useAppContext } from "./context/AppContext";

export default function App() {
  const { graph, height, loading, polygons, width } = useAppContext();

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
      <Box borderRadius="sm" borderWidth={1} width={200} backgroundColor="#333333">
        <GraphPanel />
      </Box>
    </Flex>
  );
}
