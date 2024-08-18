import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack";
import useTheme from "@sidekyk/hooks/useTheme";
import { getDefaultNavigationOptions } from "@sidekyk/lib/navigation";
import { SettingsStackParams } from "@sidekyk/lib/types/navigation";
import { PasswordResetScreen } from "@sidekyk/screens/onboarding";
import {
	SettingsScreen,
	SpeechRecognitionScreen,
	AppearanceScreen,
	ExperimentalScreen,
	UsageScreen,
	ProfileScreen,
	TestSpeechScreen,
	ChatSettingsScreen,
	DeleteAccountScreen,
	FeedbackScreen,
} from "@sidekyk/screens/settings";

const SettingsNavigation = createStackNavigator<SettingsStackParams>();
export default function SettingsStack() {
	const { theme } = useTheme();
	const opts = getDefaultNavigationOptions(theme);
	const extendedOpts: StackNavigationOptions = {
		...opts,
		headerShown: true,
		headerStyle: {
			backgroundColor: theme.colors.modal,
			shadowColor: "transparent",
		},
		headerBackTitleVisible: true,
	};

	return (
		<SettingsNavigation.Navigator initialRouteName="Settings" screenOptions={extendedOpts}>
			<SettingsNavigation.Screen name="Settings" component={SettingsScreen} options={{ headerLeft: () => null }} />
			<SettingsNavigation.Screen name="Profile" component={ProfileScreen} />
			<SettingsNavigation.Screen name="Delete Account" component={DeleteAccountScreen} />
			<SettingsNavigation.Screen name="Chat settings" component={ChatSettingsScreen} />
			<SettingsNavigation.Screen name="Usage" component={UsageScreen} options={{ title: "Usage & subscription" }} />
			<SettingsNavigation.Screen name="Appearance" component={AppearanceScreen} />
			<SettingsNavigation.Screen name="Speech Recognition" component={SpeechRecognitionScreen} />
			<SettingsNavigation.Screen name="Test Speech Recognition" component={TestSpeechScreen} />
			<SettingsNavigation.Screen name="Feedback" component={FeedbackScreen} />
			<SettingsNavigation.Screen name="Experimental" component={ExperimentalScreen} />
			<SettingsNavigation.Screen name="Change Password" component={PasswordResetScreen} options={{ headerShown: true }} />
		</SettingsNavigation.Navigator>
	);
}
