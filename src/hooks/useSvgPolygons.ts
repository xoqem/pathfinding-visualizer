import { useEffect, useState } from "react";
import fetchFileAsString from "../utils/fetchFileAsString";
import getPolygonsFromSvgString from "../utils/getPolygonsFromSvgString";

export default function useSvgPolygons(filePath: string) {
  const [loading, setLoading] = useState(true);
  const [polygons, setPolygons] =
    useState<ReturnType<typeof getPolygonsFromSvgString>>(null);

  useEffect(() => {
    setLoading(true);
    fetchFileAsString(filePath).then((svgString) => {
      const newPolygons = getPolygonsFromSvgString(svgString);
      setPolygons(newPolygons);
      setLoading(false);
    });
  }, [filePath]);

  return { loading, polygons };
}
