export default async function fetchFileAsString(path: string) {
	const response = await fetch(path);
	return await response.text();
}
