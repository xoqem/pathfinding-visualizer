import { NativeSelect, Stack, Text } from "@chakra-ui/react";
import startCase from "lodash/startCase";

import AStarPathPanel from "./AStarPathPanel";
import { useMemo, useState } from "react";

enum AlgorithmType {
  aStar = "aStar",
}

export default function PathPanel() {
  const [graphType, setGraphType] = useState<AlgorithmType | null>(AlgorithmType.aStar);

  function handleGraphTypeSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setGraphType(event.target.value as AlgorithmType);
  }

  const graphTypePanel = useMemo(() => {
    switch (graphType) {
      case AlgorithmType.aStar:
        return <AStarPathPanel />;
      default:
        return <Text>Select an algorithm.</Text>
    }
  }, [graphType]);

  return (
    <Stack gap={4} padding={2} textAlign="left">
      <NativeSelect.Root>
        <NativeSelect.Field onChange={handleGraphTypeSelectChange} value={graphType || undefined}>
          {
            Object.values(AlgorithmType).map((value) => (
              <option key={value} value={value}>{startCase(value)}</option>
            ))
          }
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

      {graphTypePanel}
    </Stack>
  );
}
