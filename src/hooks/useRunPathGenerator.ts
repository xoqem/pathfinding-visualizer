import { useCallback, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { Path } from "../utils/path";

export default function useRunPathGenerator() {
	const { setAppValues } = useAppContext();
	const [busy, setBusy] = useState(false);
	const [intervalId, setIntervalId] = useState<number | null>(null);

	const runGenerator = useCallback(
		(pathGenerator: Generator<Path>) => {
			setBusy(true);

			const intervalIdInternal = setInterval(() => {
				const path = pathGenerator.next().value;

				if (path === undefined) {
					clearInterval(intervalIdInternal);
					setBusy(false);
					return;
				}

				setAppValues({
					path: {
						...path,
					},
				});
			}, 0);

			setIntervalId(intervalIdInternal);
		},
		[setAppValues],
	);

	const clearPath = useCallback(() => {
		setBusy(false);
		setAppValues({ path: null });
		if (intervalId) {
			clearInterval(intervalId);
			setIntervalId(null);
		}
	}, [intervalId, setAppValues]);

	return useMemo(
		() => ({
			busy,
			clearPath,
			runGenerator,
		}),
		[busy, clearPath, runGenerator],
	);
}
