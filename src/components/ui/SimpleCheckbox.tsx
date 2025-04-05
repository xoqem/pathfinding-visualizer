import { Checkbox } from "@chakra-ui/react";
import { useCallback } from "react";

interface Props {
	checked: boolean;
	disabled?: boolean;
	label: string;
	onChange: (value: boolean) => void;
}

export default function SimpleCheckbox({
	checked,
	disabled,
	label,
	onChange,
}: Props) {
	const handleCheckedChange = useCallback(
		({ checked }: { checked: string | boolean }) => {
			onChange(!!checked);
		},
		[onChange],
	);

	return (
		<Checkbox.Root
			checked={checked}
			disabled={disabled}
			onCheckedChange={handleCheckedChange}
		>
			<Checkbox.HiddenInput />
			<Checkbox.Control>
				<Checkbox.Indicator />
			</Checkbox.Control>
			<Checkbox.Label>{label}</Checkbox.Label>
		</Checkbox.Root>
	);
}
