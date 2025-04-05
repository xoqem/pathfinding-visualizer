import React from "react";
import { Graph } from "../utils/graph";
import { Polygon } from "pixi.js";

export interface AppValues {
  graph: Graph | null;
  height: number;
  loading: boolean;
  polygons: Polygon[] | null;
  scaleSvgToFit: boolean;
  svgFilePath: string;
  width: number;
}

export const defaultAppValues: AppValues = {
  graph: null,
  height: 400,
  loading: false,
  polygons: null,
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
