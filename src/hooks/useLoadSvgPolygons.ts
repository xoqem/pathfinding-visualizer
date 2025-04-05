import { useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import fetchFileAsString from "../utils/fetchFileAsString";
import generateSvgStringWithRandomPolygons from "../utils/generateSvgStringWithRandomPolygons";
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
		setAppValues({ loading: true, overlayPolygons: null, polygons: null });

		function getPolygonsFromSvgStringInternal(svgString: string) {
			const newPolygons = getPolygonsFromSvgString({
				height,
				scaleToFit: scaleSvgToFit,
				svgString,
				width,
			});
			// wrapping in a setTimeout is a bit of a hack, but since we call setAppValues at the
			// beginning of loadSvgPolygons, we want to wait until the next tick to call it again
			setTimeout(() => {
				setAppValues({
					loading: false,
					graph: null,
					path: null,
					polygons: newPolygons,
				});
			}, 0);
		}

		if (svgFilePath) {
			fetchFileAsString(svgFilePath).then((svgString) => {
				getPolygonsFromSvgStringInternal(svgString);
			});
		} else {
			const svgString = generateSvgStringWithRandomPolygons({
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
