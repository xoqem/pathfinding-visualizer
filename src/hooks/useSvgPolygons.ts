import { useEffect, useState } from "react";
import fetchFileAsString from "../utils/fetchFileAsString";
import getPolygonsFromSvgString from "../utils/getPolygonsFromSvgString";

interface Params {
  filePath: string;
  height: number;
  scaleToFit: boolean
  width: number;
}

export default function useSvgPolygons({ filePath, height, scaleToFit, width }: Params) {
  const [loading, setLoading] = useState(true);
  const [polygons, setPolygons] =
    useState<ReturnType<typeof getPolygonsFromSvgString>>(null);

  useEffect(() => {
    setLoading(true);
    fetchFileAsString(filePath).then((svgString) => {
      const newPolygons = getPolygonsFromSvgString({
        height,
        scaleToFit,
        svgString,
        width,
      });
      setPolygons(newPolygons);
      setLoading(false);
    });
  }, [filePath, height, scaleToFit, width]);

  return { loading, polygons };
}
