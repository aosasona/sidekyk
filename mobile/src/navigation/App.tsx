import { createStackNavigator } from "@react-navigation/stack";
import { Box, SafeView, Text } from "@sidekyk/components";
import Spinner from "@sidekyk/components/Spinner";
import useTheme from "@sidekyk/hooks/useTheme";
import { OVERRIDE_ENABLE_LOCAL_WHISPER } from "@sidekyk/lib/constants";
import { getDefaultNavigationOptions } from "@sidekyk/lib/navigation";
import { AppStackParams } from "@sidekyk/lib/types/navigation";
import { checkForUpdateOnAppLoad } from "@sidekyk/lib/update";
import { HomeScreen, NewChatScreen, ConversationScreen, CreateSidekykScreen, SidekykConversationHistoryScreen, ConversationDetailsScreen } from "@sidekyk/screens/app";
import { useAuthStore, useUserStore, useConfigStore, useWhisperStore } from "@sidekyk/stores";
import useOpenAIConfigStore from "@sidekyk/stores/oai";
import { useEffect } from "react";
import { AppState } from "react-native";
import SettingsStack from "./Settings";

const AppNavigation = createStackNavigator<AppStackParams>();
export default function AppStack() {
	const { theme } = useTheme();
	const authStore = useAuthStore();
	const userStore = useUserStore();
	const configStore = useConfigStore();
	const whisperStore = useWhisperStore();
	const oaiConfigStore = useOpenAIConfigStore();

	const opts = getDefaultNavigationOptions(theme);

	function loadUser() {
		if (!!authStore.accessToken && !userStore.email) {
			return userStore.loadUserDataFromAPI();
		}
		if (!authStore.accessToken) userStore.reset();
	}

	useEffect(() => {
		const sub = AppState.addEventListener("change", async (state) => {
			if (state === "active") {
				loadUser();
			}
		});

		// check if the user store has lost its data and if so, load data
		const interval = setInterval(() => {
			loadUser();
		}, 1000);

		return () => {
			sub.remove();
			clearInterval(interval);
		};
	}, [authStore.accessToken, userStore.email]);

	useEffect(() => {
		(async () => await checkForUpdateOnAppLoad())();
		oaiConfigStore.init();
	}, []);

	useEffect(() => {
		if (OVERRIDE_ENABLE_LOCAL_WHISPER && ((whisperStore.ctx != null && configStore.selectedWhisperModel != null) || !configStore.allowExperimentalWhisper)) return;
		whisperStore.init(configStore.selectedWhisperModel).then().catch(console.error);
	}, [whisperStore.ctx, configStore.selectedWhisperModel]);

	if (OVERRIDE_ENABLE_LOCAL_WHISPER && whisperStore.isInitializing && configStore.selectedWhisperModel != null && configStore.allowExperimentalWhisper) {
		return <WhisperInitScreen />;
	}

	return (
		<AppNavigation.Navigator initialRouteName="Home" screenOptions={opts}>
			<AppNavigation.Group>
				<AppNavigation.Screen name="Home" component={HomeScreen} />
				<AppNavigation.Screen
					name="Create Sidekyk"
					component={CreateSidekykScreen}
					options={{
						headerShown: true,
						presentation: "modal",
						headerLeft: () => null,
						headerStyle: {
							backgroundColor: theme.colors.modal,
							shadowColor: "transparent",
						},
					}}
				/>
				<AppNavigation.Screen
					name="New Chat"
					component={NewChatScreen}
					options={{
						headerShown: true,
						presentation: "modal",
						headerLeft: () => null,
						headerStyle: {
							backgroundColor: theme.colors.modal,
							shadowColor: "transparent",
						},
					}}
				/>
				<AppNavigation.Screen
					name="Details"
					component={ConversationDetailsScreen}
					options={{
						headerShown: true,
						presentation: "modal",
						title: "",
						headerLeft: () => null,
						headerStyle: {
							backgroundColor: theme.colors.modal,
							shadowColor: "transparent",
						},
					}}
				/>
				<AppNavigation.Screen name="Conversation" component={ConversationScreen} options={{ headerShown: true }} />
				<AppNavigation.Screen name="Conversation History" component={SidekykConversationHistoryScreen} options={{ headerShown: true, title: "History" }} />
			</AppNavigation.Group>

			<AppNavigation.Group screenOptions={{ presentation: "modal" }}>
				<AppNavigation.Screen name="SettingsStack" component={SettingsStack} />
			</AppNavigation.Group>
		</AppNavigation.Navigator>
	);
}

function WhisperInitScreen() {
	return (
		<SafeView>
			<Box flex={1} alignItems="center" justifyContent="center">
				<Box>
					<Spinner />
					<Text color="alt.500" fontSize="sm" mt="lg">
						Initializing ASR model, give it a moment...
					</Text>
				</Box>
			</Box>
		</SafeView>
	);
}
