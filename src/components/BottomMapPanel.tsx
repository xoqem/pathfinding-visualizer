import { HStack } from "@chakra-ui/react";
import { useAppContext } from "../context/AppContext";
import SimpleSlider from "./ui/SimpleSlider";

export default function BottomMapPanel() {
	const { graphAlpha, polygonAlpha, setAppValues } = useAppContext();

	return (
		<HStack gap={4} padding={2} textAlign="left">
			<SimpleSlider
				label="Polygon Alpha"
				max={1}
				min={0}
				onChange={(value) => setAppValues({ polygonAlpha: value })}
				step={0.1}
				value={polygonAlpha}
			/>

			<SimpleSlider
				label="Graph Alpha"
				max={1}
				min={0}
				onChange={(value) => setAppValues({ graphAlpha: value })}
				step={0.1}
				value={graphAlpha}
			/>
		</HStack>
	);
}
