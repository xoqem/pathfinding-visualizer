import { Button, HStack, NativeSelect, Stack, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import fetchFileAsString from "./utils/fetchFileAsString";
import getPolygonsFromSvgString from "./utils/getPolygonsFromSvgString";
import SimpleCheckbox from "./components/ui/SimpleCheckbox";
import { useAppContext } from "./context/AppContext";

export default function PolygonPanel() {
  const { height, width, setAppValues } = useAppContext();
  const [filePath, setFilePath] = useState("./shapes.svg");
  const [scaleToFit, setScaleToFit] = useState(true);

  const handleApplyClick = useCallback(
    () => {
      setAppValues({ loading: true, polygons: null });

      fetchFileAsString(filePath).then((svgString) => {
        const newPolygons = getPolygonsFromSvgString({
          height,
          scaleToFit,
          svgString,
          width,
        });
        setAppValues({ loading: false, polygons: newPolygons });
      });
    },
    [filePath, height, setAppValues, scaleToFit, width]
  );

  function handleClearClick() {
    setAppValues({ polygons: null });
  }

  function handleSelectChange(event: any) {
    setFilePath(event.target.value);
  }

  return (
    <Stack width={200} gap={4} p={2} textAlign="left">
      <Text fontSize="large" textAlign="center">
        Polygons
      </Text>

      <NativeSelect.Root>
        <NativeSelect.Field onChange={handleSelectChange} value={filePath}>
          <option value="./maze.svg">maze.svg</option>
          <option value="./shapes.svg">shapes.svg</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

      <SimpleCheckbox
        label="Scale to Fit"
        checked={scaleToFit}
        onChange={setScaleToFit}
      />

      <HStack justify="space-between">
        <Button variant="outline" onClick={handleClearClick}>
          Clear
        </Button>
        <Button onClick={handleApplyClick}>Apply</Button>
      </HStack>
    </Stack>
  );
}
