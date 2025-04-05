import type { PointData, Polygon } from "pixi.js";
import React from "react";
import type Graph from "../utils/graph";
import type { Path } from "../utils/path";

export interface AppValues {
	animateGraph: boolean;
	animatePath: boolean;
	clickedPoint: PointData | null;
	generatedSvgMaxShapeSize: number;
	generatedSvgNumShapes: number;
	graph: Graph | null;
	height: number;
	loading: boolean;
	path: Path | null;
	pathEndPoint: PointData;
	pathStartPoint: PointData;
	graphAlpha: number;
	polygonAlpha: number;
	polygons: Polygon[] | null;
	polygonStrokeWidth: number;
	searchAlpha: number;
	scaleSvgToFit: boolean;
	svgFilePath: string | null;
	svgString: string | null;
	width: number;
}

export const defaultAppValues: AppValues = {
	animateGraph: false,
	animatePath: false,
	clickedPoint: null,
	generatedSvgMaxShapeSize: 100,
	generatedSvgNumShapes: 10,
	graph: null,
	graphAlpha: 0.2,
	height: 400,
	loading: false,
	path: null,
	pathStartPoint: { x: 5, y: 5 },
	pathEndPoint: { x: 795, y: 395 },
	polygonAlpha: 1,
	polygons: null,
	polygonStrokeWidth: 1,
	scaleSvgToFit: true,
	searchAlpha: 0.6,
	svgFilePath: "./shapes.svg",
	svgString: null,
	width: 800,
} as const;

interface ContextValue extends AppValues {
	setAppValues: (values: Partial<AppValues>) => void;
}

const AppContext = React.createContext<ContextValue>({
	...defaultAppValues,
	setAppValues: () => {},
});

export default AppContext;

export function useAppContext() {
	return React.useContext(AppContext);
}
