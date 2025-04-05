import { Card, Center, Flex, Spinner, Tabs } from "@chakra-ui/react";

import { useEffect } from "react";
import { LuShapes } from "react-icons/lu";
import { PiGraph } from "react-icons/pi";
import { TbRoute } from "react-icons/tb";
import { useAppContext } from "../context/AppContext";
import useLoadSvgPolygons from "../hooks/useLoadSvgPolygons";
import GraphPanel from "./GraphPanel";
import PathPanel from "./PathPanel";
import PixiApp from "./PixiApp";
import PolygonPanel from "./PolygonsPanel";

export default function App() {
	const { height, loading, width } = useAppContext();
	const loadSvgPolygons = useLoadSvgPolygons();

	// biome-ignore lint/correctness/useExhaustiveDependencies: empty array for dependencies to only run once
	useEffect(() => {
		loadSvgPolygons();
	}, []);

	return (
		<Center>
			<Flex direction="row" columnGap={4} padding={2}>
				<Flex direction="column" rowGap={4}>
					<Card.Root
						height={height + 2}
						minHeight={height + 2}
						minWidth={width + 2}
						overflow="hidden"
						width={width + 2}
					>
						{loading ? (
							<Center height="100%" width="100%">
								<Spinner />
							</Center>
						) : (
							<PixiApp />
						)}
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
					</Tabs.Root>
				</Card.Root>
			</Flex>
		</Center>
	);
}
