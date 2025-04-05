import React from "react";
import { Graph } from "../utils/graph";
import { Polygon } from "pixi.js";

export const defaultAppValues = {
  graph: null,
  height: 400,
  loading: false,
  polygons: null,
  width: 800,
} as const;

export interface AppValues {
  graph: Graph | null;
  height: number;
  loading: boolean;
  polygons: Polygon[] | null;
  width: number;
}

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
