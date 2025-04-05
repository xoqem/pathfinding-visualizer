import type { PointData } from "pixi.js";

function generateRandomPolygon({
	height,
	maxShapeSize,
	width,
}: {
	height: number;
	maxShapeSize: number;
	width: number;
}): PointData[] {
	const numPoints = Math.floor(Math.random() * 5) + 3;
	const centerX = Math.random() * width;
	const centerY = Math.random() * height;
	const points = Array.from({ length: numPoints }, (_, i) => {
		const angle = (i / numPoints) * Math.PI * 2;
		const radius = Math.random() * maxShapeSize;
		const x = Math.cos(angle) * radius + centerX;
		const y = Math.sin(angle) * radius + centerY;
		return { x: Math.floor(x), y: Math.floor(y) };
	});
	return points;
}

function generateRandomPolygons({
	height,
	numShapes,
	maxShapeSize,
	width,
}: {
	height: number;
	numShapes: number;
	maxShapeSize: number;
	width: number;
}): PointData[][] {
	return Array.from({ length: numShapes }, () =>
		getRandomPolygon({ height, maxShapeSize, width }),
	);
}
