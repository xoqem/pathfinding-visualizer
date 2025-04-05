import { HStack } from "@chakra-ui/react";
import { useAppContext } from "../context/AppContext";
import SimpleSlider from "./ui/SimpleSlider";

export default function BottomMapPanel() {
	const { graphAlpha, overlayAlpha, polygonAlpha, searchAlpha, setAppValues } =
		useAppContext();

	return (
		<HStack gap={4} padding={2} textAlign="left">
			<SimpleSlider
				label="Polygon Alpha"
				max={1}
				min={0}
				onChange={(value) => setAppValues({ polygonAlpha: value })}
				step={0.1}
				value={polygonAlpha}
				minWidth={125}
			/>

			<SimpleSlider
				label="Graph Alpha"
				max={1}
				min={0}
				onChange={(value) => setAppValues({ graphAlpha: value })}
				step={0.1}
				value={graphAlpha}
				minWidth={110}
			/>

			<SimpleSlider
				label="Search Alpha"
				max={1}
				min={0}
				onChange={(value) => setAppValues({ searchAlpha: value })}
				step={0.1}
				value={searchAlpha}
				minWidth={115}
			/>

			<SimpleSlider
				label="Overlay Alpha"
				max={1}
				min={0}
				onChange={(value) => setAppValues({ overlayAlpha: value })}
				step={0.1}
				value={overlayAlpha}
				minWidth={125}
			/>
		</HStack>
	);
}
