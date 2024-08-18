import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Box, CustomPressable, SafeView, Spinner, Swipeable, Text } from "@sidekyk/components";
import useTheme from "@sidekyk/hooks/useTheme";
import { getConversationsBySidekykID } from "@sidekyk/lib/requests/conversations";
import { GetConversationResponse } from "@sidekyk/lib/types/generated";
import { AppStackScreenProps } from "@sidekyk/lib/types/navigation";
import { RefreshControl, useWindowDimensions } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LeftItems, RightItems } from "@sidekyk/components/Conversation";
import { useCallback, useLayoutEffect, useState } from "react";
import { showErrorAlert } from "@sidekyk/lib/error";
import { LoadArgs } from "@sidekyk/lib/types/conversation";
import { useFocusEffect } from "@react-navigation/native";

export default function SidekykConversationHistoryScreen({ route, navigation }: AppStackScreenProps<"Conversation History">) {
	const { sidekyk } = route.params;
	const {
		theme: { colors },
	} = useTheme();
	const { height } = useWindowDimensions();

	const [data, setData] = useState<GetConversationResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [page, setPage] = useState({ current: 0, total: 0 });

	if (!route.params.sidekyk) {
		navigation.goBack();
		return null;
	}

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<CustomPressable onPress={() => navigation.navigate("Conversation", { sidekyk, conversationID: undefined })} enableHaptics>
					<Ionicons name="ios-add" size={26} color={colors.primary} />
				</CustomPressable>
			),
		});
	}, [sidekyk.sidekyk_id]);

	useFocusEffect(
		useCallback(() => {
			(async () => await load({ reload: data.length > 0 }))();
		}, [])
	);

	async function load({ reload, overrideCurrentPage }: Partial<LoadArgs> = { reload: false }) {
		const setLoadingState = reload ? setIsRefreshing : setIsLoading;
		try {
			const pageToLoad = reload ? 1 : overrideCurrentPage || page.current + 1;
			const size = reload ? data.length : 15;
			if (pageToLoad - 1 >= page.total && page.total > 0) return;
			setLoadingState(true);
			const res = await getConversationsBySidekykID(sidekyk.sidekyk_id, { page: pageToLoad, size });
			if (page.total <= 0) setPage((prev) => ({ ...prev, total: res.total_pages }));
			setData(reload ? res.data : data.concat(res.data));
			if (!reload) setPage((prev) => ({ ...prev, current: pageToLoad })); // only increment page if not refreshing or reloading
		} catch (error) {
			showErrorAlert(error);
		} finally {
			setLoadingState(false);
		}
	}

	if (isLoading) {
		return (
			<SafeView forceInset={{ top: "never" }}>
				<Box flex={1} justifyContent="center" alignItems="center">
					<Spinner color="primary" isLoading />
				</Box>
			</SafeView>
		);
	}

	function renderConversations({ item: conversation }: { item: GetConversationResponse; index: number }) {
		const title = conversation.title;

		function setTitle(val: string) {
			setData(data.map((c) => (c.conversation_id === conversation.conversation_id ? { ...c, title: val } : c)));
		}

		dayjs.extend(relativeTime);
		const lastUpdated = dayjs(new Date(conversation.last_message.created_at * 1000)).fromNow();

		function removeConversationFromList() {
			setData(data.filter((c) => c.conversation_id !== conversation.conversation_id));
		}

		const left = () => <LeftItems conversationId={conversation.conversation_id} currentTitle={conversation.title} isPublic={conversation.is_public} cb={(t) => setTitle(t)} />;
		const right = () => <RightItems conversationId={conversation.conversation_id} cb={removeConversationFromList} />;

		return (
			<Swipeable RightItems={right} LeftItems={left} overshootLeft={false} overshootRight={false}>
				<CustomPressable onPress={() => navigation.navigate("Conversation", { conversationID: conversation.conversation_id, sidekyk })} enableHaptics retainOpacity>
					<Box bg="bg">
						<Box borderBottomWidth={0.6} borderColor="alt.100" py="lg" pl="base" pr="md" ml="container">
							<Box flexDirection="row" justifyContent="space-between" alignItems="center" nobg>
								<Box flex={1} flexGrow={1} justifyContent="space-between" py="xs" mr="lg" nobg>
									<Text>{title}</Text>
									<Box nobg>
										<Text fontSize="sm" fontWeight={400} color="alt.400" mt="md" numberOfLines={1}>
											{conversation.last_message.content}
										</Text>
									</Box>
								</Box>

								<Box alignItems="flex-end" justifyContent="space-between" nobg>
									<Ionicons name="ios-chevron-forward-outline" size={12} color={colors.alt[200]} />
									<Text fontSize="sm" fontWeight={400} color="alt.400" mt="md">
										{lastUpdated}
									</Text>
								</Box>
							</Box>
						</Box>
					</Box>
				</CustomPressable>
			</Swipeable>
		);
	}

	return (
		<SafeView forceInset={{ top: "never" }}>
			<Box flex={1} minHeight={height}>
				<FlashList
					data={data}
					keyExtractor={(item) => item.conversation_id.toString() + item.created_at + item.title + item.last_message.created_at}
					renderItem={renderConversations}
					estimatedItemSize={100}
					refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => load({ reload: true })} tintColor={colors.primary} />}
					onEndReached={() => load({ overrideCurrentPage: page.current + 1 })}
				/>
			</Box>
		</SafeView>
	);
}
