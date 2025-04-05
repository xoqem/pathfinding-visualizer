import { useCallback } from "react";
import fetchFileAsString from "../utils/fetchFileAsString";
import getPolygonsFromSvgString from "../utils/getPolygonsFromSvgString";
import { useAppContext } from "../context/AppContext";

export default function useLoadSvgPolygons() {
  const { height, scaleSvgToFit, svgFilePath, width, setAppValues } =
    useAppContext();

  const loadSvgPolygons = useCallback(() => {
    setAppValues({ loading: true, polygons: null });

    fetchFileAsString(svgFilePath).then((svgString) => {
      const newPolygons = getPolygonsFromSvgString({
        height,
        scaleToFit: scaleSvgToFit,
        svgString,
        width,
      });
      setAppValues({ loading: false, polygons: newPolygons });
    });
  }, [height, scaleSvgToFit, svgFilePath, width, setAppValues]);

  return loadSvgPolygons;
}
