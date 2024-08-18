import { SettingsStackScreenProps } from "@sidekyk/lib/types/navigation";
import { useUserStore } from "@sidekyk/stores";
import { useMemo } from "react";
import Box from "../Box";
import Text from "../Text/Text";
import CustomPressable from "../CustomPressable";

interface Props {
	navigation: SettingsStackScreenProps<"Settings">["navigation"];
}

export default function UserOverview({ navigation }: Props) {
	const user = useUserStore();

	const initials = useMemo(() => {
		return (user.first_name?.slice(0, 1) || "X") + (user.last_name?.slice(0, 1) || "X");
	}, [user.first_name, user.last_name]);

	return (
		<CustomPressable onPress={() => navigation.push("Profile")}>
			<Box bg="alt.100" flexDirection="row" alignItems="center" justifyContent="space-between" px="lg" py="md" borderRadius={15}>
				<Box bg="transparent" flexShrink={1} flexDirection="row" alignItems="center">
					{user.hasLoadedUser ? (
						<Box width={50} height={50} bg="alt.200" alignItems="center" justifyContent="center" borderRadius={999}>
							<Text fontSize="xl" color="text">
								{initials}
							</Text>
						</Box>
					) : (
						<Box width={50} height={50} bg="alt.200" borderRadius={999} />
					)}
					<Box width={10} bg="transparent" />
					<Box flexGrow={user.hasLoadedUser ? 0 : 1} flexShrink={1} bg="transparent">
						{user.hasLoadedUser ? (
							<Text fontSize="lg" fontWeight={600} mb="sm" numberOfLines={2}>
								{user.first_name} {user.last_name}
							</Text>
						) : (
							<Box width="75%" height={8} bg="alt.200" mb="base" borderRadius={8} />
						)}
						{user.hasLoadedUser ? (
							<Text color="alt.400" fontSize="sm">
								{user.email}
							</Text>
						) : (
							<Box width="40%" height={8} bg="alt.200" borderRadius={8} />
						)}
					</Box>
				</Box>
				{user.hasLoadedUser ? (
					<Box px="base" py="sm" borderRadius={10} nobg>
						<Text color={user.subscription_type != "FREE" ? "emerald.500" : "alt.300"} fontSize="sm" fontWeight={800}>
							{user?.subscription_type?.replace("_", " ")}
							{user?.is_trial ? " - TRIAL" : ""}
						</Text>
					</Box>
				) : null}
			</Box>
		</CustomPressable>
	);
}
