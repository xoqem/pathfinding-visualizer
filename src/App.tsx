import { Card, Center, Flex, Spinner, Tabs } from "@chakra-ui/react";

import PixiApp from "./PixiApp";
import GraphPanel from "./GraphPanel";
import { useAppContext } from "./context/AppContext";
import PolygonPanel from "./PolygonsPanel";
import { LuGitGraph, LuSettings, LuShapes } from "react-icons/lu";
import useLoadSvgPolygons from "./hooks/useLoadSvgPolygons";
import { useEffect } from "react";

export default function App() {
  const { graph, height, loading, polygons, width } = useAppContext();
  const loadSvgPolygons = useLoadSvgPolygons();

  useEffect(() => {
    loadSvgPolygons();
  }, []);

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
          <Tabs.Root defaultValue="graph">
            <Tabs.List>
              <Tabs.Trigger value="polygons">
                <LuShapes />
                Polygons
              </Tabs.Trigger>
              <Tabs.Trigger value="graph">
                <LuGitGraph />
                Graph
              </Tabs.Trigger>
              <Tabs.Trigger value="settings">
                <LuSettings />
                Settings
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="polygons">
              <PolygonPanel />
            </Tabs.Content>
            <Tabs.Content value="graph">
              <GraphPanel />
            </Tabs.Content>
            <Tabs.Content value="settings">TODO</Tabs.Content>
          </Tabs.Root>
        </Card.Root>
      </Flex>
    </Center>
  );
}
