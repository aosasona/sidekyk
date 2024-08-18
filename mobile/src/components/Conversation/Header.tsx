import { Box, Text, CustomPressable } from "@sidekyk/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Octicons } from "@expo/vector-icons";
import ProfileImage from "@sidekyk/components/ProfileImage";
import useTheme from "@sidekyk/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { AppStackScreenProps } from "@sidekyk/lib/types/navigation";
import Back from "../Back";
import { BlurView } from "expo-blur";
import { memo, ReactNode, useMemo } from "react";
import { IS_IOS } from "@sidekyk/lib/constants";

type HeaderProps = AppStackScreenProps<"Conversation"> & {
	theme: ReturnType<typeof useTheme>["theme"];
	colorScheme: ReturnType<typeof useTheme>["colorScheme"];
};

function Header({ navigation, route, theme, colorScheme }: HeaderProps) {
	const { sidekyk } = route.params;
	const { top } = useSafeAreaInsets();

	function UnoptimisedWrapper({ children }: { children: ReactNode }) {
		return IS_IOS ? (
			<BlurView
				intensity={100}
				tint={colorScheme}
				style={{ borderBottomWidth: 0.6, borderBottomColor: theme.colors.alt[100], paddingTop: top, paddingBottom: 10, paddingHorizontal: 16 }}>
				<Box flexDirection="row" alignItems="center" justifyContent="space-between" nobg>
					{children}
				</Box>
			</BlurView>
		) : (
			<Box bg="bg" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottomWidth={0.6} borderBottomColor="alt.100" pt={top} pb="md" px="container">
				{children}
			</Box>
		);
	}

	const OptimisedWrapper = useMemo(() => memo(UnoptimisedWrapper), [colorScheme, top]);

	return (
		<OptimisedWrapper>
			<Back onPress={() => navigation.goBack()} />

			<Box alignItems="center" alignSelf="center" nobg>
				<CustomPressable onPress={() => navigation.push("Details", { data: sidekyk, conversationID: route.params.conversationID })} enableHaptics>
					<ProfileImage size={36} uri={sidekyk?.avatar_url} bg={sidekyk?.color as any} padding={6} alignSelf="center" />
					<Box flexDirection="row" alignItems="center" alignSelf="center" mt="base" nobg>
						<Text color="alt.700" fontSize="sm" fontWeight={600} textAlign="center" mr={2}>
							{sidekyk?.name}
						</Text>
						<Ionicons name="chevron-forward" size={13} color={theme.colors.alt[200]} />
					</Box>
				</CustomPressable>
			</Box>

			<Box px="sm" nobg>
				<CustomPressable onPress={() => navigation.push("Conversation History", { sidekyk })} enableHaptics>
					<Octicons name="history" size={22} color={theme.colors.primary} />
				</CustomPressable>
			</Box>
		</OptimisedWrapper>
	);
}

export default memo(Header);
