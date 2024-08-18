import Box from "../Box";
import CustomPressable from "../CustomPressable";
import { Ionicons } from "@expo/vector-icons";
import { AppException, showErrorAlert } from "@sidekyk/lib/error";
import { changeConversationTitle, deleteConversation } from "@sidekyk/lib/requests/conversations";
import { Alert } from "react-native";
import { fire } from "react-native-alertbox";
import { comingSoon } from "@sidekyk/lib/constants";

type RightItemsProps = {
	conversationId: number;
	cb?: () => void;
};

function RightItems({ conversationId, cb }: RightItemsProps) {
	function handleDelete() {
		Alert.alert("Confirm", "Are you sure you want to delete this conversation?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => await runDelete(),
			},
		]);
	}

	async function runDelete() {
		try {
			await deleteConversation(conversationId, cb);
		} catch (e) {
			showErrorAlert(e);
		}
	}

	return (
		<CustomPressable style={{ height: "100%", aspectRatio: 1 }} onPress={handleDelete}>
			<Box height="100%" bg="red.500" alignItems="center" justifyContent="center">
				<Ionicons name="ios-trash" size={24} color="white" />
			</Box>
		</CustomPressable>
	);
}

type LeftItemsProps = {
	conversationId: number;
	currentTitle: string;
	isPublic: boolean;
	cb: (title: string) => void;
};

function LeftItems({ conversationId, currentTitle, isPublic, cb }: LeftItemsProps) {
	function handleEdit() {
		fire({
			title: "Edit Conversation Title",
			message: "Enter a new title for this conversation",
			actions: [
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Save",
					onPress: async ({ title }: { title?: string }) => {
						try {
							if (!title) throw new AppException("Please enter a title");
							if (title === currentTitle) return;
							await changeConversationTitle(conversationId, title);
							cb(title);
						} catch (e) {
							showErrorAlert(e);
						}
					},
				},
			],
			fields: [
				{
					name: "title",
					placeholder: currentTitle,
				},
			],
		});
	}

	function shareLink() {
		if (!isPublic) {
			showErrorAlert(new AppException("Only public conversations can be shared, you can change this in the conversation settings."));
			return;
		}

		//TODO: implement this
		comingSoon();
	}

	return (
		<Box flexDirection="row">
			<CustomPressable style={{ height: "100%", aspectRatio: 1 }} onPress={shareLink}>
				<Box height="100%" bg="purple.500" alignItems="center" justifyContent="center">
					<Ionicons name="ios-link" size={24} color="white" />
				</Box>
			</CustomPressable>
			<CustomPressable style={{ height: "100%", aspectRatio: 1 }} onPress={handleEdit}>
				<Box height="100%" bg="blue.500" alignItems="center" justifyContent="center">
					<Ionicons name="ios-pencil-sharp" size={24} color="white" />
				</Box>
			</CustomPressable>
		</Box>
	);
}

export { RightItems, LeftItems };
