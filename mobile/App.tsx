import * as SplashScreen from "expo-splash-screen";
import {
	Inter_100Thin,
	Inter_200ExtraLight,
	Inter_300Light,
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	Inter_800ExtraBold,
	Inter_900Black,
} from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import RootNavigation from "@sidekyk/navigation";
import { useLayoutEffect, useState } from "react";
import { ThemeProvider } from "styled-components/native";
import useTheme from "@hooks/useTheme";
import { AlertBox } from "react-native-alertbox";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import * as Sentry from "sentry-expo";

(async () => await SplashScreen.preventAutoHideAsync())();

Sentry.init({
	dsn: "https://ff501b40017c4555a924caa74a8c89e6@o4505273430441984.ingest.sentry.io/4505273434898432",
	enableInExpoDevelopment: true,
	debug: __DEV__,
});

function App() {
	const [rootViewIsReady, setRootViewisReady] = useState(false);
	const [loaded] = useFonts({
		Inter_100Thin,
		Inter_200ExtraLight,
		Inter_300Light,
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
		Inter_800ExtraBold,
		Inter_900Black,
	});

	useLayoutEffect(() => {
		if (loaded && rootViewIsReady) {
			(async () => await SplashScreen.hideAsync())();
		}
	}, [loaded, rootViewIsReady]);

	const { theme, colorScheme } = useTheme();

	return (
		<ThemeProvider theme={theme}>
			<StatusBar style={colorScheme == "dark" ? "light" : "dark"} />
			<ActionSheetProvider>
				<RootNavigation sendReadySignal={() => setRootViewisReady(true)} />
			</ActionSheetProvider>
			<AlertBox />
		</ThemeProvider>
	);
}

export default App;
