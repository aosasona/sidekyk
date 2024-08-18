import { Alert } from "react-native";
import Box from "../Box";
import Text from "../Text/Text";
import { useAuthStore, useUserStore } from "@sidekyk/stores";
import CustomPressable from "../CustomPressable";

export default function SignOut() {
	const authStore = useAuthStore();
	const userStore = useUserStore();

	function signOut() {
		Alert.alert("Confirm", "Are you sure you want to sign out?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Sign Out",
				style: "destructive",
				onPress: () => {
					userStore.reset();
					authStore.signOut();
				},
			},
		]);
	}
	return (
		<Box mt="xl" transparent>
			<CustomPressable onPress={signOut}>
				<Box width="100%" bg="alt.100" py="lg" borderRadius={10}>
					<Text color="red.500" textAlign="center">
						Sign Out
					</Text>
				</Box>
			</CustomPressable>
		</Box>
	);
}
