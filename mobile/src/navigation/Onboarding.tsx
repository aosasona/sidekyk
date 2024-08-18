import { createStackNavigator } from "@react-navigation/stack";
import { OnboardingStackParams } from "@lib/types/navigation";
import WelcomeScreen from "@sidekyk/screens/onboarding/Welcome";
import { EmailVerificationScreen, PasswordResetScreen, SignInScreen, SignUpScreen } from "@sidekyk/screens/onboarding";
import useTheme from "@sidekyk/hooks/useTheme";
import { getDefaultNavigationOptions } from "@sidekyk/lib/navigation";

const OnboardingStack = createStackNavigator<OnboardingStackParams>();
export default function OnboardingNavigation() {
	const { theme } = useTheme();

	const opts = getDefaultNavigationOptions(theme);

	return (
		<OnboardingStack.Navigator initialRouteName="Welcome" screenOptions={opts}>
			<OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
			<OnboardingStack.Screen name="SignIn" component={SignInScreen} />
			<OnboardingStack.Screen name="SignUp" component={SignUpScreen} />
			<OnboardingStack.Screen name="VerifyEmail" component={EmailVerificationScreen} options={{ headerShown: true, headerTitle: "Verify email" }} />
			<OnboardingStack.Screen name="Reset Password" component={PasswordResetScreen} options={{ headerShown: true }} />
		</OnboardingStack.Navigator>
	);
}
