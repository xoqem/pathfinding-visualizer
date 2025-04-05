import type { Polygon } from "pixi.js";
import React from "react";
import type Graph from "../utils/graph";
import type { Path } from "../utils/path";

export interface AppValues {
	generatedSvgMaxShapeSize: number;
	generatedSvgNumShapes: number;
	graph: Graph | null;
	height: number;
	loading: boolean;
	path: Path | null;
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
	generatedSvgMaxShapeSize: 100,
	generatedSvgNumShapes: 10,
	graph: null,
	graphAlpha: 0.2,
	height: 400,
	loading: false,
	path: null,
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
