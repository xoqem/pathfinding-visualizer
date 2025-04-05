import { Button, HStack, NativeSelect, Stack } from "@chakra-ui/react";
import SimpleCheckbox from "./components/ui/SimpleCheckbox";
import { useAppContext } from "./context/AppContext";
import useLoadSvgPolygons from "./hooks/useLoadSvgPolygons";

export default function PolygonPanel() {
  const { scaleSvgToFit, svgFilePath, setAppValues } = useAppContext();
  const loadSvgPolygons = useLoadSvgPolygons();

  function handleClearClick() {
    setAppValues({ polygons: null });
  }

  function handleFilePathSelectChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setAppValues({ svgFilePath: event.target.value });
  }

  return (
    <Stack gap={4} padding={2} textAlign="left">
      <NativeSelect.Root>
        <NativeSelect.Field
          onChange={handleFilePathSelectChange}
          value={svgFilePath}
        >
          <option value="./maze.svg">maze.svg</option>
          <option value="./shapes.svg">shapes.svg</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

      <SimpleCheckbox
        label="Scale to Fit"
        checked={scaleSvgToFit}
        onChange={(value) => setAppValues({ scaleSvgToFit: value })}
      />

      <HStack justify="space-between">
        <Button variant="outline" onClick={handleClearClick}>
          Clear
        </Button>
        <Button onClick={loadSvgPolygons}>Apply</Button>
      </HStack>
    </Stack>
  );
}
