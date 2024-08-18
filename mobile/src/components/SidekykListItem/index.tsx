import { capitaliseFirst } from "@sidekyk/lib/string";
import { memo } from "react";
import Box from "../Box";
import CustomPressable from "../CustomPressable";
import ProfileImage from "../ProfileImage";
import Swipeable from "../Swipeable";
import { Text } from "../Text";
import { Ionicons } from "@expo/vector-icons";
import { Alert, StyleSheet } from "react-native";
import { deleteSidekyk } from "@sidekyk/lib/requests/sidekyk";
import { ThemeType } from "@sidekyk/lib/types/theme";
import { AppStackScreenProps } from "@sidekyk/lib/types/navigation";
import { GetSidekykResponse as Sidekyk } from "@sidekyk/lib/types/generated";
import { showErrorAlert } from "@sidekyk/lib/error";

type Props = {
	sidekyk: Sidekyk;
	onPress: () => void;
	isLast?: boolean;
	theme: ThemeType;
	navigation: AppStackScreenProps<"New Chat">["navigation"];
	mutate: () => void;
};

function SidekykListItem({ theme, sidekyk, isLast, navigation, onPress, mutate }: Props) {
	const bw = !isLast ? StyleSheet.hairlineWidth : 0;
	const bc = !isLast ? `${theme.colors.alt[200]}8A` : 0;

	function handleDelete() {
		Alert.alert("Confirm", `Are you sure you want to permanently delete this sidekyk? This action CANNOT be undone.`, [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Delete",
				style: "destructive",
				onPress: () => {
					deleteSidekyk(sidekyk.sidekyk_id, mutate).then().catch(showErrorAlert);
				},
			},
		]);
	}

	function RightItems() {
		return (
			<CustomPressable style={{ height: "100%", aspectRatio: 1 }} onPress={handleDelete}>
				<Box height="100%" bg="red.500" alignItems="center" justifyContent="center">
					<Ionicons name="ios-trash" size={24} color="white" />
				</Box>
			</CustomPressable>
		);
	}

	function LeftItems() {
		return (
			<CustomPressable style={{ height: "100%", aspectRatio: 1 }} onPress={() => navigation.push("Details", { data: sidekyk })}>
				<Box height="100%" bg="blue.500" alignItems="center" justifyContent="center">
					<Ionicons name="ios-information-circle" size={24} color="white" />
				</Box>
			</CustomPressable>
		);
	}

	return (
		<Swipeable RightItems={RightItems} LeftItems={LeftItems} overshootRight={false} overshootLeft={false}>
			<CustomPressable onPress={onPress} retainOpacity>
				<Box bg="modal" flexDirection="row" alignItems="center" pl="container">
					<ProfileImage size={45} bg={(sidekyk?.color ?? "#E5E5E5") as any} uri={sidekyk?.avatar_url} padding={4} my={6} />
					<Box flexGrow={1} height="100%" justifyContent="center" borderBottomWidth={bw} borderBottomColor={bc} px="base" ml="base">
						<Box nobg>
							<Text fontSize="base" fontWeight={600}>
								{sidekyk.name}
							</Text>
						</Box>
						<Box mt="base" nobg>
							<Text color="alt.400" fontSize="sm">
								{capitaliseFirst(sidekyk.personality_name)}
							</Text>
						</Box>
					</Box>
				</Box>
			</CustomPressable>
		</Swipeable>
	);
}

export default memo(SidekykListItem);
