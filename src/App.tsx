import { Card, Center, Flex, Spinner } from "@chakra-ui/react";

import PixiApp from "./PixiApp";
import GraphPanel from "./GraphPanel";
import { useAppContext } from "./context/AppContext";
import PolygonPanel from "./PolygonsPanel";

export default function App() {
  const { graph, height, loading, polygons, width } = useAppContext();

  return (
    <Center>
      <Flex columnGap={4} padding={2}>
        <Card.Root
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
        </Card.Root>
        <Card.Root width={400}>
          <GraphPanel />
          <PolygonPanel />
        </Card.Root>
      </Flex>
    </Center>
  );
}
