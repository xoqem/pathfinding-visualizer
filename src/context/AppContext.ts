import type { Polygon } from "pixi.js";
import React from "react";
import type { Graph } from "../utils/graph";
import type { Path } from "../utils/path";

export interface AppValues {
	generatedSvgMaxShapeSize: number;
	generatedSvgNumShapes: number;
	graph: Graph | null;
	height: number;
	loading: boolean;
	path: Path | null;
	polygons: Polygon[] | null;
	polygonStrokeWidth: number;
	scaleSvgToFit: boolean;
	svgFilePath: string | null;
	svgString: string | null;
	width: number;
}

export const defaultAppValues: AppValues = {
	generatedSvgMaxShapeSize: 100,
	generatedSvgNumShapes: 10,
	graph: null,
	height: 400,
	loading: false,
	path: null,
	polygons: null,
	polygonStrokeWidth: 1,
	scaleSvgToFit: true,
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
