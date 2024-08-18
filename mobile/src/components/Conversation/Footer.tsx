import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Box, CustomPressable } from "@sidekyk/components";
import { AppTheme, ThemeType } from "@sidekyk/lib/types/theme";
import { Dispatch, SetStateAction, useMemo } from "react";
import { TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IS_ANDROID } from "@sidekyk/lib/constants";

type FooterProps = {
	message: string;
	setMessage: Dispatch<SetStateAction<string>>;
	onSend: () => Promise<void> | void;
	voiceActions: {
		start: () => void;
		stop: () => void;
		canTranscribe: boolean;
	};
	focusOnRender: boolean;
	theme: ThemeType;
	colorScheme: AppTheme;
};

export default function Footer({ message, setMessage, focusOnRender, theme: { colors }, colorScheme, onSend, voiceActions: { start, stop, canTranscribe } }: FooterProps) {
	const { bottom } = useSafeAreaInsets();

	const accentColor = useMemo(() => (colorScheme == "dark" ? colors.alt[200] : colors.alt[300]), [colorScheme, colors]);

	function handleTextChange(text: string) {
		if (text.match(/^[\s\n\t]*$/) || text.trim().length == 0 || text.length == 0) text = "";
		setMessage(text);
	}

	return (
		<Box width="100%" position="absolute" bottom={0} borderTopWidth={0.6} borderTopColor="alt.100" zIndex={20}>
			<BlurView intensity={100} tint={colorScheme} style={{ width: "100%" }}>
				<Box bg={IS_ANDROID ? "bg" : "transparent"} py={6} px={14} pb={bottom + 7}>
					<Box flexDirection="row" alignItems="center" justifyContent="space-between" p="sm">
						<TextInput
							value={message}
							onChangeText={handleTextChange}
							placeholder="Type a message..."
							placeholderTextColor={accentColor}
							cursorColor={colors.primary}
							selectionColor={colors.primary}
							autoCapitalize="sentences"
							autoFocus={focusOnRender}
							maxLength={2250}
							style={{
								color: colors.text,
								backgroundColor: "transparent",
								flexGrow: 1,
								flexShrink: 1,
								maxHeight: 128,
								borderWidth: 0.75,
								borderColor: accentColor,
								paddingBottom: IS_ANDROID ? 4 : 10,
								paddingTop: IS_ANDROID ? 4 : 10,
								paddingHorizontal: 10,
								borderRadius: 10,
								marginRight: 10,
							}}
							enablesReturnKeyAutomatically
							multiline
						/>
						{message?.length > 0 || !canTranscribe ? (
							<CustomPressable onPress={() => onSend()} disabled={message?.length == 0} enableHaptics={message?.length > 0} style={{ alignSelf: "flex-end" }}>
								<Box alignSelf="flex-end" bg="primary" justifyContent="center" alignItems="center" p={7} borderRadius={9999} style={{ aspectRatio: 1 }}>
									<Ionicons name="ios-arrow-up" size={20} color="white" />
								</Box>
							</CustomPressable>
						) : (
							<CustomPressable onPressIn={start} onPressOut={stop} style={{ alignSelf: "flex-end" }} enableHaptics>
								<Box alignSelf="flex-end" bg="rose.500" justifyContent="center" alignItems="center" p={7} borderRadius={9999} style={{ aspectRatio: 1 }}>
									<Ionicons name="ios-mic" size={20} color="white" />
								</Box>
							</CustomPressable>
						)}
					</Box>
				</Box>
			</BlurView>
		</Box>
	);
}
