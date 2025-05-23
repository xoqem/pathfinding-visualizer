import { Application, extend } from "@pixi/react";
import { Container, type FederatedPointerEvent, Graphics } from "pixi.js";
import { useCallback } from "react";

import { useAppContext } from "../context/AppContext";
import drawBackground from "../graphics/drawBackground";
import drawGraph from "../graphics/drawGraph";
import drawOverlay from "../graphics/drawOverlay";
import drawPath from "../graphics/drawPath";
import drawPolygons from "../graphics/drawPolygons";

extend({
	Container,
	Graphics,
});

export default function PixiApp() {
	const {
		graph,
		graphAlpha,
		height,
		onPointClick,
		overlayPolygons,
		overlayPolygonsAlpha,
		path,
		polygonAlpha,
		polygons,
		polygonStrokeWidth,
		searchAlpha,
		width,
	} = useAppContext();

	const drawCallback = useCallback(
		(graphics: Graphics) => {
			graphics.clear();

			drawBackground({ graphics, height, width });
			drawPolygons({
				graphics,
				alpha: polygonAlpha,
				polygons,
				strokeWidth: polygonStrokeWidth,
			});
			drawOverlay({ alpha: overlayPolygonsAlpha, overlayPolygons, graphics });
			drawGraph({ alpha: graphAlpha, graph, graphics });
			drawPath({ searchAlpha, graphics, path });
		},
		[
			graph,
			graphAlpha,
			height,
			overlayPolygons,
			overlayPolygonsAlpha,
			path,
			polygonAlpha,
			polygons,
			polygonStrokeWidth,
			searchAlpha,
			width,
		],
	);

	const handleMouseDown = useCallback(
		(event: FederatedPointerEvent) => {
			onPointClick?.({
				x: Math.round(event.screen.x),
				y: Math.round(event.screen.y),
			});
		},
		[onPointClick],
	);

	return (
		<Application width={width} height={height}>
			<pixiContainer
				x={0}
				y={0}
				interactive={!!onPointClick}
				onMouseDown={handleMouseDown}
				cursor={onPointClick ? "crosshair" : "default"}
				width={width}
				height={height}
			>
				<pixiGraphics draw={drawCallback} width={width} height={height} />
			</pixiContainer>
		</Application>
	);
}
