import { NavigationContainer } from "@react-navigation/native";
import { useAuthStore } from "@sidekyk/stores";
import { useEffect, useState } from "react";
import { PermissionsAndroid, Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppStack from "./App";
import OnboardingNavigation from "./Onboarding";
import * as Sentry from "@sentry/react-native";

type RootNavigationProps = {
	sendReadySignal: () => void;
};

if (Platform.OS == "android") {
	PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
		title: "Sidekyk Microphone Permission",
		message: "Sidekyk needs access to your microphone to transcribe your speech.",
		buttonNeutral: "Ask Me Later",
		buttonNegative: "Cancel",
		buttonPositive: "OK",
	});
}

export default function RootNavigation(props: RootNavigationProps) {
	const authStore = useAuthStore();

	const [auth, setAuth] = useState({
		isLoading: true,
		isAuthenticated: false,
	});
	const [readyState, setReadyState] = useState({
		view: false,
		navigation: false,
	});

	useEffect(() => {
		authStore
			.isLoggedIn()
			.then((res) => setAuth((prev) => ({ ...prev, isAuthenticated: res })))
			.catch((err) => (__DEV__ ? console.error(err) : Sentry.captureException(err)))
			.finally(() => setAuth((prev) => ({ ...prev, isLoading: false })));
	}, [authStore.accessToken]);

	useEffect(() => {
		if (readyState.view && readyState.navigation && !auth.isLoading) props.sendReadySignal();
	}, [readyState, auth.isLoading, auth.isAuthenticated]);

	return (
		<SafeAreaProvider>
			<View style={{ flex: 1 }} onLayout={() => setReadyState((state) => ({ ...state, view: true }))}>
				<NavigationContainer onReady={() => setReadyState((state) => ({ ...state, navigation: true }))}>
					{!auth.isAuthenticated && !auth.isLoading ? <OnboardingNavigation /> : <AppStack />}
				</NavigationContainer>
			</View>
		</SafeAreaProvider>
	);
}
