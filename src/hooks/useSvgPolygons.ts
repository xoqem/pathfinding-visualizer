import { useEffect, useState } from "react";
import fetchFileAsString from "../utils/fetchFileAsString";
import getPolygonsFromSvgString from "../utils/getPolygonsFromSvgString";

export default function useSvgPolygons(filePath: string) {
  const [loading, setLoading] = useState(false);
  const [polygons, setPolygons] =
    useState<ReturnType<typeof getPolygonsFromSvgString>>(null);
  const [svgString, setSvgString] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchFileAsString(filePath).then((svgString) => {
      setSvgString(svgString);
      const polygons = getPolygonsFromSvgString(svgString);
      setPolygons(polygons);
      setLoading(false);
    });
  }, [filePath]);

  useEffect(() => {
    const polygons = getPolygonsFromSvgString(svgString);
    setPolygons(polygons);
    setLoading(false);
  }, [svgString]);

  return { loading, polygons };
}
