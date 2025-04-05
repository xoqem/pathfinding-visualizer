import { Checkbox } from "@chakra-ui/react";
import { useCallback } from "react";

interface Props {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function SimpleCheckbox({ label, onChange, checked }: Props) {
  const handleCheckedChange = useCallback(
    ({ checked }: { checked: string | boolean }) => {
      onChange(!!checked);
    },
    [onChange]
  );

  return (
    <Checkbox.Root checked={checked} onCheckedChange={handleCheckedChange}>
      <Checkbox.HiddenInput />
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label>{label}</Checkbox.Label>
    </Checkbox.Root>
  );
}
