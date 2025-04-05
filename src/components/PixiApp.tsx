import { Application, extend } from "@pixi/react";
import { Container, type FederatedPointerEvent, Graphics } from "pixi.js";
import { useCallback } from "react";

import { useAppContext } from "../context/AppContext";
import drawBackground from "../graphics/drawBackground";
import drawGraph from "../graphics/drawGraph";
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
		path,
		polygonAlpha,
		polygons,
		polygonStrokeWidth,
		searchAlpha,
		width,
		setAppValues,
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
			drawGraph({ alpha: graphAlpha, graph, graphics });
			drawPath({ searchAlpha, graphics, path });
		},
		[
			graph,
			graphAlpha,
			height,
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
			setAppValues({
				clickedPoint: {
					x: event.screen.x,
					y: event.screen.y,
				},
			});
		},
		[setAppValues],
	);

	return (
		<Application width={width} height={height}>
			<pixiContainer x={0} y={0} interactive onMouseDown={handleMouseDown}>
				<pixiGraphics draw={drawCallback} />
			</pixiContainer>
		</Application>
	);
}
