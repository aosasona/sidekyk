import { StackScreenProps } from "@react-navigation/stack";
import { GetSidekykResponse as Sidekyk, SendFeedbackRequest } from "./generated";

export type OnboardingStackParams = {
	Welcome: undefined;
	SignUp: undefined;
	SignIn: undefined;
	VerifyEmail: { email: string };
	"Reset Password": { email?: string };
};

export type OnboardingStackScreenProps<S extends keyof OnboardingStackParams> = StackScreenProps<OnboardingStackParams, S>;

export type SettingsStackParams = {
	Settings: undefined;
	Profile: undefined;
	Feedback: { type: SendFeedbackRequest["type"] };
	Usage: undefined;
	Appearance: undefined;
	Plans: undefined;
	"Chat settings": undefined;
	"Speech Recognition": undefined;
	"Test Speech Recognition": undefined;
	Experimental: undefined;
	"Licences and Disclaimers": undefined;
	"Change Password": { email?: string };
	"Delete Account": undefined;
};

export type SettingsStackScreenProps<S extends keyof SettingsStackParams> = StackScreenProps<SettingsStackParams, S>;

export type AppStackParams = {
	Home: undefined;
	Conversation: { conversationID?: number; sidekyk: Sidekyk };
	"Create Sidekyk": { sidekyk?: Sidekyk } | undefined;
	"New Chat": undefined;
	"Conversation History": { sidekyk: Sidekyk };
	Details: { data: Sidekyk; conversationID?: number };
	SettingsStack: undefined;
};

export type AppStackScreenProps<S extends keyof AppStackParams> = StackScreenProps<AppStackParams, S>;
