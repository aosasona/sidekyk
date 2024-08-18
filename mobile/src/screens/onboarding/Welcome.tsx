import { Ionicons } from "@expo/vector-icons";
import { SafeView, Box, Heading, Text, Button, ScrollView } from "@sidekyk/components";
import useTheme from "@sidekyk/hooks/useTheme";
import { OnboardingStackScreenProps } from "@sidekyk/lib/types/navigation";
import { ThemeColor } from "@sidekyk/lib/types/theme";

export default function WelcomeScreen({ navigation }: OnboardingStackScreenProps<"Welcome">) {
	return (
		<SafeView>
			<Box flex={1}>
				<Welcome />

				<Box width="100%" position="absolute" bottom={28} px="container">
					<Button onPress={() => navigation.replace("SignIn")} enableHaptics>
						I understand, continue
					</Button>
				</Box>
			</Box>
		</SafeView>
	);
}

function Welcome() {
	const { theme } = useTheme();
	return (
		<ScrollView flex={1}>
			<Box flex={1} width="100%" px="container">
				<Heading color="text" fontSize={50} textAlign="center" mt="xl">
					Welcome to Sidekyk
				</Heading>

				<Box mt="2xl" px="container">
					<Box flexDirection="row" alignItems="center" justifyContent="space-between">
						<Ionicons name="ios-warning-outline" size={28} color={theme.colors.primary} />
						<Box width="85%">
							<Text fontSize="sm">Disclaimer</Text>
							<Text fontSize="sm" fontWeight={400} color="alt.500" lineHeight="20px" mt="sm">
								Consult professionals for legal, financial, and medical advice; AI models provide general information but should not be solely relied upon.
							</Text>
						</Box>
					</Box>

					<Box flexDirection="row" alignItems="center" justifyContent="space-between" mt="xl">
						<Ionicons name="ios-mic-outline" size={28} color={theme.colors.primary} />
						<Box width="85%">
							<Text fontSize="sm">Audio processing</Text>
							<Text fontSize="sm" fontWeight={400} color="alt.500" lineHeight="20px" mt="sm">
								Sidekyk processes audio locally on your device, ensuring privacy and security. No voice chats or audio data are transmitted or stored externally.
							</Text>
						</Box>
					</Box>

					<Box flexDirection="row" alignItems="center" justifyContent="space-between" mt="xl">
						<Ionicons name="ios-chatbox-outline" size={28} color={theme.colors.primary} />
						<Box width="85%">
							<Text fontSize="sm">Moderation</Text>
							<Text fontSize="sm" fontWeight={400} color="alt.500" lineHeight="20px" mt="sm">
								Conversations and sidekyk persona descriptions that contain profanity, hate speech, or other inappropriate content will be flagged or removed.
							</Text>
						</Box>
					</Box>

					<Box flexDirection="row" alignItems="center" justifyContent="space-between" mt="xl">
						<Ionicons name="document-attach-outline" size={28} color={theme.colors.primary} />
						<Box width="85%">
							<Text fontSize="sm">Data rights</Text>
							<Text fontSize="sm" fontWeight={400} color="alt.500" lineHeight="20px" mt="sm">
								You reserve the right to export your data in any supported format, and to delete your data from our servers at any point in time, excluding flagged content.
							</Text>
						</Box>
					</Box>
				</Box>
			</Box>
		</ScrollView>
	);
}

type IconProps = {
	name: keyof typeof Ionicons.glyphMap;
	bg: ThemeColor;
	size?: number;
};
function Icon({ name, bg, size }: IconProps) {
	return (
		<Box bg={bg}>
			<Ionicons name={name} size={size || 24} color="white" />
		</Box>
	);
}
