import React, { useCallback, useMemo, useState } from "react";
import AppContext, { AppValues, defaultAppValues } from "./AppContext";

export default function AppProvider({ children }: React.PropsWithChildren<object>) {
  const [internalAppValues, setInternalAppValues] = useState<AppValues>(defaultAppValues);

  const setAppValues = useCallback((newAppValues: Partial<AppValues>) => {
    setInternalAppValues((prev) => ({
      ...prev,
      ...newAppValues,
    }));
  }, [setInternalAppValues]);

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
