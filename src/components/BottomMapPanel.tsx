import { Button, HStack } from "@chakra-ui/react";
import { GrTest } from "react-icons/gr";
import { useAppContext } from "../context/AppContext";
import SimpleSlider from "./ui/SimpleSlider";

export default function BottomMapPanel() {
	const {
		graphAlpha,
		overlayPolygonsAlpha,
		polygonAlpha,
		searchAlpha,
		setAppValues,
		showStatsPanel,
	} = useAppContext();

	return (
		<HStack gap={4} padding={2} textAlign="left" wrap="wrap">
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
				onChange={(value) => setAppValues({ overlayPolygonsAlpha: value })}
				step={0.1}
				value={overlayPolygonsAlpha}
				minWidth={125}
			/>

			<Button
				variant={showStatsPanel ? "solid" : "outline"}
				onClick={() => setAppValues({ showStatsPanel: !showStatsPanel })}
			>
				<GrTest />
			</Button>
		</HStack>
	);
}
