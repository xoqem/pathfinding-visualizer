import { HStack, Slider, SliderRootProps } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";

interface Props extends Omit<SliderRootProps, 'onChange' | 'value'> {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function SimpleSlider({
  label,
  onChange,
  value,
  ...props
}: Props) {
  const handleValueChange = useCallback(
    ({ value }: { value: number[] }) => {
      onChange(value[0]);
    },
    [onChange]
  );

  const valueArray = useMemo(() => [value], [value]);

  return (
    <Slider.Root
      {...props}
      value={valueArray}
      onValueChange={handleValueChange}
    >
      <HStack justify="space-between">
      <Slider.Label>{label}</Slider.Label>
        <Slider.ValueText />
      </HStack>
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
  );
}
