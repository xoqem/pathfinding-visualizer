import { Stack } from "@chakra-ui/react";
import SimpleCheckbox from "./ui/SimpleCheckbox";
import { useColorMode } from "./ui/color-mode";

export default function SettingsPanel() {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<SimpleCheckbox
				label="Dark Mode"
				checked={colorMode === "dark"}
				onChange={toggleColorMode}
			/>
		</Stack>
	);
}
