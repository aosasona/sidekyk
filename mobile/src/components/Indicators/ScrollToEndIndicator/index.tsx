import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import CustomPressable from "@sidekyk/components/CustomPressable";
import { IS_ANDROID } from "@sidekyk/lib/constants";
import { Message } from "@sidekyk/lib/types/generated";
import { ThemeType } from "@sidekyk/lib/types/theme";
import { AnimatePresence, MotiView } from "moti";
import { RefObject } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

type Props = {
	theme: ThemeType;
	chatRef: RefObject<FlashList<Message>>;
	visible: boolean;
};

export default function ScrollToEndIndicator({ chatRef, theme, visible }: Props) {
	const { bottom } = useSafeAreaInsets();

	return (
		<AnimatePresence>
			{visible ? (
				<MotiView
					from={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ type: "timing", duration: 200 }}
					style={{
						position: "absolute",
						alignSelf: "flex-start",
						zIndex: 0,
						right: IS_ANDROID ? 14 : 12,
						bottom: IS_ANDROID ? 80 : bottom * 3.2,
					}}>
					<CustomPressable onPress={() => chatRef.current?.scrollToEnd({ animated: true })} style={{ borderRadius: 999, overflow: "hidden" }} enableHaptics>
						<BlurView intensity={40} tint="default" style={{ aspectRatio: 1, padding: 10 }}>
							<Ionicons name="chevron-down" size={24} color={theme.colors.primary} />
						</BlurView>
					</CustomPressable>
				</MotiView>
			) : null}
		</AnimatePresence>
	);
}
