import { Box, CustomPressable, ListeningIndicator, SafeView, ScrollToEndIndicator, Spinner, Text, TypingIndicator } from "@sidekyk/components";
import useTheme from "@sidekyk/hooks/useTheme";
import { AnimatePresence, MotiView } from "moti";
import { AppStackScreenProps } from "@sidekyk/lib/types/navigation";
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, NativeScrollEvent, NativeSyntheticEvent, useWindowDimensions } from "react-native";
import { IS_ANDROID, IS_IOS } from "@sidekyk/lib/constants";
import { FlashList } from "@shopify/flash-list";
import { Footer, Header, ChatBubble, NoChatHistory } from "@sidekyk/components/Conversation";
import { Message } from "@sidekyk/lib/types/generated";
import { useTranscription } from "@sidekyk/hooks/audio";
import { TranscriptionResult } from "@sidekyk/lib/types/speech";
import { useConfigStore } from "@sidekyk/stores";
import { getMessagesByConversationID } from "@sidekyk/lib/requests/messages";
import { sendText } from "@sidekyk/lib/actions/message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { showErrorAlert } from "@sidekyk/lib/error";
import { useKeyboard } from "@react-native-community/hooks";

const pageSize = 15;

export default function ConversationScreen({ navigation, route }: AppStackScreenProps<"Conversation">) {
	if (!route.params || (!route.params.conversationID && !route.params.sidekyk)) {
		navigation.goBack();
		return null;
	}

	const { keyboardShown } = useKeyboard();
	const { theme, colorScheme } = useTheme();
	const { top, bottom } = useSafeAreaInsets();
	const { width, height } = useWindowDimensions();
	const config = useConfigStore();

	const chatViewRef = useRef<FlashList<Message>>(null);

	const [chatHistory, setChatHistory] = useState<Map<string, Message>>(new Map());
	const [conversationID, setConversationID] = useState<number | undefined>(route.params?.conversationID || undefined);
	const [message, setMessage] = useState("");
	const [page, setPage] = useState({ current: 0, total: 0 });
	const [status, setStatus] = useState({ sending: false, loading: false });
	const [shouldShowScrollToEndIndicator, setShouldShowScrollToEndIndicator] = useState(false);
	const [shouldReload, setShouldReload] = useState(true);

	const isNewConversation = useMemo(() => route.params?.sidekyk && !route.params?.conversationID, []);

	const { listHeight, listWidth } = useMemo(() => ({ listHeight: height - top * 4, listWidth: width - 40 }), []);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: true,
			header: () => <Header navigation={navigation} route={route} theme={theme} colorScheme={colorScheme} />,
			headerTransparent: IS_IOS,
		});
	}, [route.params, colorScheme]);

	useEffect(() => {
		if (keyboardShown && chatViewRef?.current && !shouldShowScrollToEndIndicator) {
			if (chatHistory.size > 1) {
				setTimeout(() => {
					try {
						chatViewRef?.current?.scrollToEnd({ animated: true });
					} catch (e) {}
				}, 50);
			}
		}
	}, [keyboardShown]);

	useEffect(() => {
		if (route.params?.conversationID) {
			if (!shouldReload) return setShouldReload(true);
			setPage({ current: 0, total: 0 });
			setChatHistory(new Map());
			setConversationID(route.params.conversationID);
			getMessages(route.params.conversationID, true)
				.then(() => {
					setTimeout(() => chatViewRef?.current?.scrollToEnd({ animated: true }), 150);
				})
				.catch((_) => navigation.goBack());
			return;
		}

		// reset state if conversationID is undefined (for example, creating a new conversation from the conversation history page)
		setChatHistory(new Map());
		setConversationID(undefined);
		setPage({ current: 0, total: 0 });
	}, [navigation, route.params.conversationID]);

	useEffect(() => {
		if (conversationID && route.params.conversationID != conversationID) {
			setShouldReload(false);
			navigation.setParams({ conversationID });
		}
	}, [conversationID]);

	const { start, stop, isListening, canTranscribe } = useTranscription(onResult);

	function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
		const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
		const shouldNotLoadMore = IS_ANDROID ? contentOffset.y > 0 : contentOffset.y >= 0;
		setShouldShowScrollToEndIndicator(layoutMeasurement.height + contentOffset.y < contentSize.height - height / 2.75);
		if (status.loading || shouldNotLoadMore || isNewConversation) return;
		getMessages(conversationID).then().catch(showErrorAlert);
	}

	async function getMessages(id?: number, disregardPageState = false) {
		if (!id) return;
		let currentPage = disregardPageState ? 0 : page.current;
		let total = disregardPageState ? 0 : page.total;
		if (currentPage >= total && total != 0 && currentPage != 0) return;
		setStatus((prev) => ({ ...prev, loading: true }));
		currentPage = currentPage + 1;
		const res = await getMessagesByConversationID(id, { page: currentPage, size: pageSize });
		insertIntoHistory(res.data);
		setPage((prev) => ({ ...prev, current: prev.current + 1 }));
		if (res.total_pages && total <= 0) setPage((prev) => ({ ...prev, total: res.total_pages }));
		setStatus((prev) => ({ ...prev, loading: false }));
	}

	function insertIntoHistory(messages: Message[]) {
		const newHistory = new Map();
		for (let i = 0; i < messages.length; i++) {
			const message = messages?.[i];
			if (!message) continue;
			newHistory.set(message?.message_id?.toString(), message);
		}
		setChatHistory((prev) => new Map([...newHistory, ...prev]));
	}

	function onResult(e: TranscriptionResult) {
		if (e.hasError && e.result == "") return;
		setMessage(e.result?.trim());
		if (config.sendMessageImmediately) send();
		return;
	}

	function extractKey(item: Message, index: number) {
		return `${index.toString()}-${item?.message_id.toString()}-${item?.created_at}`;
	}

	const send = useCallback(
		async function () {
			await sendText({
				ref: chatViewRef,
				message: message,
				conversationID: route.params?.conversationID,
				sidekykID: route.params?.sidekyk?.sidekyk_id,
				setSending: (value: boolean) => setStatus((prev) => ({ ...prev, sending: value })),
				setMessage,
				setChatHistory,
				setConversationID,
			});
		},
		[message, route.params, chatHistory.size, chatViewRef?.current]
	);

	const memoizedRenderChatBubble = useCallback(
		({ item, index }: { item: Message; index: number }) => {
			const mt = index == 0 ? (page.current < page.total ? 18 : IS_ANDROID ? theme.space.md : page.current < page.total ? top + 18 : top * 1.6) : 0;
			const mb = index == chatHistory.size - 1 ? 100 : 0;

			return (
				<MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginTop: mt, marginBottom: mb }}>
					<ChatBubble message={item} theme={theme} />
				</MotiView>
			);
		},
		[theme.colors.bg, page.current, page.total, chatHistory.size, status.sending]
	);

	const MemoizedEmpty = useCallback(
		function () {
			return (
				<Fragment>
					{!status.loading ? (
						<CustomPressable style={{ flex: 1, height: height * 0.8 }} onPress={Keyboard.dismiss} retainOpacity>
							<Box flex={1} alignItems="center" justifyContent="center">
								<NoChatHistory />
							</Box>
						</CustomPressable>
					) : null}
				</Fragment>
			);
		},
		[status.loading]
	);
	const MemoizedSpinner = useCallback(
		function () {
			const mt = IS_ANDROID ? 24 : top + 48;
			return (
				<AnimatePresence>
					{status.loading ? (
						<MotiView
							from={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							style={{ width: "100%", backgroundColor: "transparent", justifyContent: "center", marginTop: mt }}>
							<Spinner color="primary" />
						</MotiView>
					) : page.current < page.total ? (
						<Box flexDirection="row" width="100%" alignItems="center" justifyContent="center" mt={mt}>
							<Ionicons name="ios-arrow-down" size={16} color={theme.colors.alt[300]} />
							<Text color="alt.300" fontSize="sm" textAlign="center" ml="xs">
								swipe down to see more
							</Text>
						</Box>
					) : null}
				</AnimatePresence>
			);
		},
		[status.loading, page.current, page.total]
	);

	return (
		<SafeView forceInset={{ bottom: "never" }}>
			<KeyboardAvoidingView behavior={IS_IOS ? "padding" : "height"} keyboardVerticalOffset={IS_ANDROID ? top + 30 : -bottom} style={{ flex: 1 }}>
				<Box flex={1}>
					<Box flex={1}>
						<FlashList
							ref={chatViewRef}
							data={Array.from(chatHistory.values())}
							keyExtractor={extractKey}
							renderItem={memoizedRenderChatBubble}
							ListEmptyComponent={<MemoizedEmpty />}
							ListHeaderComponent={<MemoizedSpinner />}
							contentContainerStyle={{ paddingHorizontal: theme.space.container }}
							scrollEventThrottle={60}
							estimatedItemSize={260}
							estimatedListSize={{ height: listHeight, width: listWidth }}
							onScroll={handleScroll}
							onEndReached={() => setShouldShowScrollToEndIndicator(false)}
							extraData={chatHistory}
							maintainVisibleContentPosition={{
								minIndexForVisible: 0,
							}}
						/>
					</Box>
					<Footer
						setMessage={setMessage}
						message={message}
						onSend={send}
						voiceActions={{ start, stop, canTranscribe }}
						focusOnRender={chatHistory.size == 0 && !route.params.conversationID}
						theme={theme}
						colorScheme={colorScheme}
					/>
					<TypingIndicator visible={status.sending} imageUri={route.params?.sidekyk?.avatar_url} imageBg={route.params?.sidekyk?.color} />
					<ScrollToEndIndicator chatRef={chatViewRef} theme={theme} visible={shouldShowScrollToEndIndicator} />
					<ListeningIndicator theme={theme} isListening={isListening} />
				</Box>
			</KeyboardAvoidingView>
		</SafeView>
	);
}
