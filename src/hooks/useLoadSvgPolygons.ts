import { useCallback } from "react";
import fetchFileAsString from "../utils/fetchFileAsString";
import getPolygonsFromSvgString from "../utils/getPolygonsFromSvgString";
import { useAppContext } from "../context/AppContext";
import generateSvgString from "../utils/generateSvgString";

export default function useLoadSvgPolygons() {
  const { height, scaleSvgToFit, svgFilePath, width, setAppValues } =
    useAppContext();

  const loadSvgPolygons = useCallback(() => {
    setAppValues({ loading: true, polygons: null });

    function getPolygonsFromSvgStringInternal(svgString: string) {
      const newPolygons = getPolygonsFromSvgString({
        height,
        scaleToFit: scaleSvgToFit,
        svgString,
        width,
      });
      setAppValues({ loading: false, graph: null, path: null, polygons: newPolygons });
    }

    if (svgFilePath) {
      fetchFileAsString(svgFilePath).then((svgString) => {
        getPolygonsFromSvgStringInternal(svgString);
      });
    } else {
      const svgString = generateSvgString({ height, width });
      getPolygonsFromSvgStringInternal(svgString);
    }

  }, [height, scaleSvgToFit, svgFilePath, width, setAppValues]);

  return loadSvgPolygons;
}
