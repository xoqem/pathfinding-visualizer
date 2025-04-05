import { Button, HStack, Stack } from "@chakra-ui/react";

import { useAppContext } from "../../context/AppContext";

export default function AStarPathPanel() {
  const { graph, setAppValues } = useAppContext();

  function handleRunClick() {
    // TODO
  }

  function handleClearClick() {
    // TODO
  }

  return (
    <Stack gap={4} padding={2} textAlign="left">
      TODO

      <HStack justify="space-between">
        <Button variant="outline" onClick={handleClearClick}>
          Clear
        </Button>
        <Button onClick={handleRunClick}>Run</Button>
      </HStack>
    </Stack>
  );
}
