import { Stack, Text } from "@chakra-ui/react";

import ProbabilisticRoadmapGraphPanel from "./ProbabilisticRoadmapGraphPanel";
import PolygonPanel from "./PolygonsPanel";

export default function GraphPanel() {
  return (
    <Stack width={200} gap={4} p={2} textAlign="left">
      <Text fontSize="large" textAlign="center">
        Graph
      </Text>

      <ProbabilisticRoadmapGraphPanel />

      <PolygonPanel />
    </Stack>
  );
}
