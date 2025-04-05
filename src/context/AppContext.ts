import React from "react";
import { Graph } from "../utils/graph";
import { Path } from "../utils/path";
import { Polygon } from "pixi.js";

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
  generatedSvgMaxShapeSize: 20,
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
