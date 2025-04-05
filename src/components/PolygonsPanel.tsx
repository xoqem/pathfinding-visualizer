import { Button, HStack, NativeSelect, Stack } from "@chakra-ui/react";
import SimpleCheckbox from "./ui/SimpleCheckbox";
import { useAppContext } from "../context/AppContext";
import useLoadSvgPolygons from "../hooks/useLoadSvgPolygons";
import SimpleSlider from "./ui/SimpleSlider";

export default function PolygonPanel() {
  const {
    generatedSvgMaxShapeSize,
    generatedSvgNumShapes,
    polygonStrokeWidth,
    scaleSvgToFit,
    svgFilePath,
    setAppValues,
  } = useAppContext();
  const loadSvgPolygons = useLoadSvgPolygons();

  function handleClearClick() {
    setAppValues({ polygons: null });
  }

  function handleFilePathSelectChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setAppValues({ svgFilePath: event.target.value || null });
  }

  return (
    <Stack gap={4} padding={2} textAlign="left">
      <NativeSelect.Root>
        <NativeSelect.Field
          onChange={handleFilePathSelectChange}
          value={svgFilePath || undefined}
        >
          <option value={""}>Generate random shapes</option>
          <option value="./maze.svg">maze.svg</option>
          <option value="./shapes.svg">shapes.svg</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

      {svgFilePath && (
        <SimpleCheckbox
          label="Scale to Fit"
          checked={scaleSvgToFit}
          onChange={(value) => setAppValues({ scaleSvgToFit: value })}
        />
      )}

      {!svgFilePath && (
        <>
          <SimpleSlider
            label="Number of generated Shapes"
            max={200}
            min={1}
            onChange={(value) => setAppValues({ generatedSvgNumShapes: value })}
            value={generatedSvgNumShapes}
          />

          <SimpleSlider
            label="Max shape size"
            max={200}
            min={1}
            onChange={(value) =>
              setAppValues({ generatedSvgMaxShapeSize: value })
            }
            value={generatedSvgMaxShapeSize}
          />
        </>
      )}

      <SimpleSlider
        label="Stroke Width"
        max={10}
        min={1}
        onChange={(value) => setAppValues({ polygonStrokeWidth: value })}
        value={polygonStrokeWidth}
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
