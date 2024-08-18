import { AnimatePresence, MotiView } from "moti";
import Box from "../../Box";
import Text from "../../Text/Text";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@sidekyk/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IS_ANDROID } from "@sidekyk/lib/constants";
import { useMemo } from "react";

type Props = {
	isListening: boolean;
	theme: ReturnType<typeof useTheme>["theme"];
};
export default function ListeningIndicator({ isListening, theme }: Props) {
	const { bottom } = useSafeAreaInsets();

	const from = useMemo(() => (IS_ANDROID ? { top: -100 } : { bottom: -100 }), []);
	const animate = useMemo(() => (IS_ANDROID ? { top: 20 } : { bottom: bottom * 3.1 }), []);
	const exit = useMemo(() => (IS_ANDROID ? { top: -100 } : { bottom: -100 }), []);

	return (
		<AnimatePresence>
			{isListening ? (
				<MotiView
					from={{ opacity: 0, ...from }}
					animate={{ opacity: 1, ...animate }}
					exit={{ opacity: 0, ...exit }}
					transition={{ type: "timing", duration: 200 }}
					style={{
						position: "absolute",
						alignSelf: "center",
						zIndex: 0,
					}}>
					<Box bg="white" flexDirection="row" alignItems="center" justifyContent="center" py="md" px="lg" borderRadius={24}>
						<Ionicons name="ios-mic-outline" size={16} color={theme.colors.primary} />
						<Text color="primary" fontSize="sm" ml="sm">
							recording...
						</Text>
					</Box>
				</MotiView>
			) : null}
		</AnimatePresence>
	);
}
