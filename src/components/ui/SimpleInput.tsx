import { Field, Input } from "@chakra-ui/react";
import { type ChangeEvent, useCallback } from "react";

interface Props {
	disabled?: boolean;
	label?: string;
	onChange: (value: string) => void;
	placeholder?: string;
	value: string;
}

export default function SimpleInput({
	disabled,
	label,
	onChange,
	placeholder,
	value,
}: Props) {
	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			onChange(event.target.value);
		},
		[onChange],
	);

	return (
		<Field.Root>
			{label && <Field.Label>{label}</Field.Label>}
			<Input
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				disabled={disabled}
			/>
		</Field.Root>
	);
}
