import { Stack } from "@chakra-ui/react";
import { useAppContext } from "../context/AppContext";
import SimpleCheckbox from "./ui/SimpleCheckbox";
import { useColorMode } from "./ui/color-mode";

export default function SettingsPanel() {
	const { colorMode, toggleColorMode } = useColorMode();
	const { animateGraph, setAppValues } = useAppContext();

	return (
		<Stack gap={4} padding={2} textAlign="left">
			<SimpleCheckbox
				label="Dark Mode"
				checked={colorMode === "dark"}
				onChange={toggleColorMode}
			/>

			<SimpleCheckbox
				label="Animate Graph"
				checked={animateGraph}
				onChange={() => setAppValues({ animateGraph: !animateGraph })}
			/>
		</Stack>
	);
}
