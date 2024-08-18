import { AppTheme } from "@sidekyk/lib/types/theme";
import { useConfigStore } from "@sidekyk/stores";
import getTheme from "@sidekyk/theme";
import { useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";

export default function useTheme() {
  const deviceColorScheme = useColorScheme();
  const { theme, useDeviceTheme, accentColor, setTheme } = useConfigStore();
  useEffect(() => {
    if (useDeviceTheme) {
      setTheme((deviceColorScheme as AppTheme) ?? "light");
    }
  }, [useDeviceTheme, deviceColorScheme, accentColor]);

  const appTheme = useMemo(() => getTheme(theme, accentColor), [theme, deviceColorScheme, useDeviceTheme, accentColor]);

  return { colorScheme: theme, theme: appTheme } as const;
}
