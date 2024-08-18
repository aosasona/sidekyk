import { FlashList } from "@shopify/flash-list";
import { Dispatch, RefObject } from "react";
import { AppException, getErrorMessage, handleUnwrappedError, showErrorAlert, unwrapHTTPError } from "../error";
import { sendTextMessage } from "../requests/messages";
import { Message, SendMessageRequest, SendMessageResponse } from "../types/generated";

type SendTextDeps = {
	ref: RefObject<FlashList<Message>>;

	message: string;
	conversationID?: number;
	sidekykID?: number;

	setSending: (sending: boolean) => void;
	setMessage: (message: string) => void;
	setChatHistory: Dispatch<React.SetStateAction<Map<string, Message>>>;
	setConversationID: (id: number) => void;
};

type HistoryFunctionDeps = {
	setChatHistory: Dispatch<React.SetStateAction<Map<string, Message>>>;
};

type AddToHistoryDeps = HistoryFunctionDeps & {
	message: Message;
};

type UpdateMessageDeps = HistoryFunctionDeps & {
	id: number;
	message: Partial<Message>;
};

function addToChatHistory({ setChatHistory, message }: AddToHistoryDeps) {
	setChatHistory((prev) => {
		const newHistory = new Map(prev);
		newHistory.set(message.message_id.toString(), message);
		return newHistory;
	});
}

function updateMessage({ setChatHistory, id, message }: UpdateMessageDeps) {
	setChatHistory((prev) => {
		if (prev instanceof Map && !!id && prev.has(id.toString())) {
			const newMap = new Map(prev);
			const target = prev.get(id.toString());
			if (!target) return prev;
			newMap.set(id.toString(), { ...target, ...message });
			return newMap;
		}
		return prev;
	});
}

export async function sendText({ ref, message, conversationID, sidekykID, setSending, setMessage, setChatHistory, setConversationID }: SendTextDeps) {
	try {
		if (!message) return;
		setSending(true);

		// add the user's message to the history with a temporary id
		const randomID = Math.floor(Math.random() * 1000000);
		const userMessage: Message = {
			message_id: randomID,
			conversation_id: conversationID || 0,
			content: message,
			is_bot: false,
			is_flagged: false,
			is_disliked: false,
			prompt_tokens: 0,
			completion_tokens: 0,
			third_party_id: "",
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};
		addToChatHistory({ setChatHistory, message: userMessage });

		const req: SendMessageRequest = {
			sidekyk_id: sidekykID,
			conversation_id: conversationID,
			message,
		};
		setMessage("");
		const response = await sendTextMessage(req);
		handleUnwrappedError(unwrapHTTPError<SendMessageResponse, SendMessageRequest>(response));
		if (!response?.data) throw new AppException("No response!");

		// update the conversation id if it's not set
		if (!conversationID) setConversationID(response?.data?.conversation_id);

		// add the bot's message to the history with the real id
		const botMessage: Message = {
			message_id: response?.data.bot_message_id,
			conversation_id: response?.data.conversation_id,
			content: response.data.completion,
			is_bot: true,
			is_flagged: false,
			is_disliked: false,
			prompt_tokens: response.data.prompt_tokens,
			completion_tokens: response.data.completion_tokens,
			third_party_id: "",
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};
		addToChatHistory({ setChatHistory, message: botMessage });
		if (ref) setTimeout(() => ref?.current?.scrollToEnd({ animated: true }), 50);
		setSending(false);

		// update the user's message with the real id and conversation_id
		updateMessage({ setChatHistory, id: randomID, message: { message_id: response?.data.user_message_id, conversation_id: response.data.conversation_id } });
	} catch (error) {
		showErrorAlert(error);
		return;
	} finally {
		setSending(false);
	}
}
