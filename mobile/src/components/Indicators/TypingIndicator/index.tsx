import { Animated, Easing } from "react-native";
import React, { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, MotiView } from "moti";
import useTheme from "@sidekyk/hooks/useTheme";
import Box from "../../Box";
import ProfileImage from "@sidekyk/components/ProfileImage";
import { IS_ANDROID } from "@sidekyk/lib/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type Props = {
	visible: boolean;
	imageUri?: string;
	imageBg?: string;
};

const FADE_TO = 0.25;

export default function TypingIndicator({ visible, imageUri, imageBg }: Props) {
	const { bottom } = useSafeAreaInsets();
	const { theme } = useTheme();

	const dotOne = useRef(new Animated.Value(FADE_TO)).current;
	const dotTwo = useRef(new Animated.Value(FADE_TO)).current;
	const dotThree = useRef(new Animated.Value(FADE_TO)).current;

	useEffect(() => {
		startAnimation();
	}, []);

	const animationConfig: Animated.TimingAnimationConfig = {
		toValue: 1,
		duration: 200,
		easing: Easing.linear,
		useNativeDriver: true,
	};

	const startAnimation = () => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(dotOne, {
					...animationConfig,
				}),
				Animated.timing(dotOne, {
					...animationConfig,
					toValue: FADE_TO,
				}),
				Animated.timing(dotTwo, {
					...animationConfig,
				}),
				Animated.timing(dotTwo, {
					...animationConfig,
					toValue: FADE_TO,
				}),
				Animated.timing(dotThree, {
					...animationConfig,
				}),
				Animated.timing(dotThree, {
					...animationConfig,
					toValue: FADE_TO,
				}),
			]),
		).start(startAnimation);
	};

	function Dot({ opacity }: { opacity: Animated.Value }) {
		return <Animated.View style={{ backgroundColor: theme.colors.alt[700], width: 9, aspectRatio: 1, borderRadius: 99, marginHorizontal: 2.5, opacity: opacity }} />;
	}

	const from = { bottom: -100 };
	const animate = { bottom: IS_ANDROID ? 80 : bottom * 3.2 };
	const exit = { bottom: -100 };

	return (
		<AnimatePresence>
			{visible ? (
				<MotiView
					from={{ opacity: 0, ...from }}
					animate={{ opacity: 1, ...animate }}
					exit={{ opacity: 0, ...exit }}
					transition={{ type: "timing", duration: 200 }}
					style={{
						position: "absolute",
						alignSelf: "flex-start",
						zIndex: 0,
						left: IS_ANDROID ? 14 : 12,
					}}>
					<Box bg="alt.100" flexDirection="row" px={8} py={8} borderRadius={24} borderWidth={1} borderColor="alt.200">
						<ProfileImage size={22} uri={imageUri} padding={4} bg={imageBg as any} />
						<Box flexDirection="row" alignItems="center" px="sm">
							<Dot opacity={dotOne} />
							<Dot opacity={dotTwo} />
							<Dot opacity={dotThree} />
						</Box>
					</Box>
				</MotiView>
			) : null}
		</AnimatePresence>
	);
}
