import { Card, Center, Flex, Spinner, Tabs, VStack } from "@chakra-ui/react";

import { useEffect } from "react";
import { LuSettings, LuShapes } from "react-icons/lu";
import { PiGraph } from "react-icons/pi";
import { TbRoute } from "react-icons/tb";
import { useAppContext } from "../context/AppContext";
import useLoadSvgPolygons from "../hooks/useLoadSvgPolygons";
import BottomMapPanel from "./BottomMapPanel";
import GraphPanel from "./GraphPanel";
import PathPanel from "./PathPanel";
import PixiApp from "./PixiApp";
import PolygonPanel from "./PolygonsPanel";
import SettingsPanel from "./SettingsPanel";
import StatsPanel from "./StatsPanel";

export default function App() {
	const { height, loading, width } = useAppContext();
	const loadSvgPolygons = useLoadSvgPolygons();

	// biome-ignore lint/correctness/useExhaustiveDependencies: empty array for dependencies to only run once
	useEffect(() => {
		loadSvgPolygons();
	}, []);

	const mapCardBorderBuffer = 2;

	return (
		<Center>
			<Flex direction="column" rowGap={4}>
				<Flex direction="row" columnGap={4} padding={2}>
					<Flex direction="column" rowGap={4}>
						<Card.Root
							height={height + mapCardBorderBuffer}
							minHeight={height + mapCardBorderBuffer}
							minWidth={width + mapCardBorderBuffer}
							overflow="hidden"
							width={width + mapCardBorderBuffer}
						>
							{loading ? (
								<Center height="100%" width="100%">
									<Spinner />
								</Center>
							) : (
								<PixiApp />
							)}
						</Card.Root>
						<Card.Root width={width + 2}>
							<BottomMapPanel />
						</Card.Root>
					</Flex>
					<Card.Root width={400}>
						<Tabs.Root defaultValue="graph">
							<Tabs.List>
								<Tabs.Trigger value="polygons">
									<LuShapes />
									Polygons
								</Tabs.Trigger>
								<Tabs.Trigger value="graph">
									<PiGraph />
									Graph
								</Tabs.Trigger>
								<Tabs.Trigger value="path">
									<TbRoute />
									Path
								</Tabs.Trigger>
								<Tabs.Trigger value="settings">
									<LuSettings />
									Settings
								</Tabs.Trigger>
							</Tabs.List>
							<Tabs.Content value="polygons">
								<PolygonPanel />
							</Tabs.Content>
							<Tabs.Content value="graph">
								<GraphPanel />
							</Tabs.Content>
							<Tabs.Content value="path">
								<PathPanel />
							</Tabs.Content>
							<Tabs.Content value="settings">
								<SettingsPanel />
							</Tabs.Content>
						</Tabs.Root>
					</Card.Root>
				</Flex>
				<Card.Root>
					<StatsPanel />
				</Card.Root>
			</Flex>
		</Center>
	);
}
