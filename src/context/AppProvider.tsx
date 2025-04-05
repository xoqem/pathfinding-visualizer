import type React from "react";
import { useCallback, useMemo, useState } from "react";
import AppContext, { type AppValues, defaultAppValues } from "./AppContext";

export default function AppProvider({
	children,
}: React.PropsWithChildren<object>) {
	const [internalAppValues, setInternalAppValues] =
		useState<AppValues>(defaultAppValues);

	const setAppValues = useCallback((newAppValues: Partial<AppValues>) => {
		setInternalAppValues((prev) => ({
			...prev,
			...newAppValues,
		}));
	}, []);

	const contextValue = useMemo(() => {
		return {
			...internalAppValues,
			setAppValues,
		};
	}, [internalAppValues, setAppValues]);

	return (
		<AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
	);
}
