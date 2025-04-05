import React from "react";
import { Graph } from "../utils/graph";
import { Path } from "../utils/path";
import { Polygon } from "pixi.js";

export interface AppValues {
  graph: Graph | null;
  height: number;
  loading: boolean;
  path: Path | null;
  polygons: Polygon[] | null;
  polygonStrokeWidth: number;
  scaleSvgToFit: boolean;
  svgFilePath: string;
  width: number;
}

export const defaultAppValues: AppValues = {
  graph: null,
  height: 400,
  loading: false,
  path: null,
  polygons: null,
  polygonStrokeWidth: 1,
  scaleSvgToFit: true,
  svgFilePath: "./shapes.svg",
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
