import { useEffect, useState } from "react";
import fetchFileAsString from "../utils/fetchFileAsString";
import getPolygonsFromSvgString from "../utils/getPolygonsFromSvgString";
import { useAppContext } from "../context/AppContext";

interface Params {
  filePath: string;
  height: number;
  scaleToFit: boolean
  width: number;
}

export default function useSvgPolygons({ filePath, scaleToFit, }: Params) {
  const [loading, setLoading] = useState(true);
  const { height, width, setAppValues } = useAppContext();

  useEffect(() => {
    setLoading(true);
    fetchFileAsString(filePath).then((svgString) => {
      const newPolygons = getPolygonsFromSvgString({
        height,
        scaleToFit,
        svgString,
        width,
      });
      setAppValues({ polygons: newPolygons });
      setLoading(false);
    });
  }, [filePath, height, setAppValues, scaleToFit, width]);

  return { loading };
}
