import { Octicons } from "@expo/vector-icons";
import { Box, Text } from "@sidekyk/components";
import useTheme from "@sidekyk/hooks/useTheme";

export default function NoChatHistory() {
	const {
		theme: { colors },
	} = useTheme();

	return (
		<Box maxWidth="75%" px="md" py="base" mt="md">
			<Text color="alt.400" fontSize="sm" fontWeight={500} textAlign="center" lineHeight="23px" textBreakStrategy="balanced">
				👋 Send a message to start a new conversation! Or tap on the history icon ( <Octicons name="history" size={12} color={colors.primary} /> ) to view your previous
				conversations with this sidekyk.
			</Text>
		</Box>
	);
}
