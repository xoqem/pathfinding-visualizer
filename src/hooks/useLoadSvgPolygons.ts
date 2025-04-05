import { useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import fetchFileAsString from "../utils/fetchFileAsString";
import generateSvgString from "../utils/generateSvgString";
import getPolygonsFromSvgString from "../utils/getPolygonsFromSvgString";

export default function useLoadSvgPolygons() {
	const {
		height,
		generatedSvgMaxShapeSize,
		generatedSvgNumShapes,
		scaleSvgToFit,
		svgFilePath,
		width,
		setAppValues,
	} = useAppContext();

	const loadSvgPolygons = useCallback(() => {
		setAppValues({ loading: true, polygons: null });

		function getPolygonsFromSvgStringInternal(svgString: string) {
			const newPolygons = getPolygonsFromSvgString({
				height,
				scaleToFit: scaleSvgToFit,
				svgString,
				width,
			});
			setAppValues({
				loading: false,
				graph: null,
				path: null,
				polygons: newPolygons,
			});
		}

		if (svgFilePath) {
			fetchFileAsString(svgFilePath).then((svgString) => {
				getPolygonsFromSvgStringInternal(svgString);
			});
		} else {
			const svgString = generateSvgString({
				height,
				maxShapeSize: generatedSvgMaxShapeSize,
				numShapes: generatedSvgNumShapes,
				width,
			});
			getPolygonsFromSvgStringInternal(svgString);
		}
	}, [
		height,
		generatedSvgMaxShapeSize,
		generatedSvgNumShapes,
		scaleSvgToFit,
		svgFilePath,
		width,
		setAppValues,
	]);

	return loadSvgPolygons;
}
