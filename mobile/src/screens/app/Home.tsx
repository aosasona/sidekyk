import { Box, Heading, HomeMenu, LinkButton, SafeView, Spinner, Text } from "@sidekyk/components";
import { AppStackScreenProps } from "@sidekyk/lib/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@sidekyk/hooks/useTheme";
import { GetConversationResponse } from "@sidekyk/lib/types/generated";
import { getConversations } from "@sidekyk/lib/requests/conversations";
import { ConversationCard } from "@sidekyk/components/Conversation";
import { memo, useCallback, useEffect, useState } from "react";
import { ThemeType } from "@sidekyk/lib/types/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RefreshControl, useWindowDimensions } from "react-native";
import { useUserStore } from "@sidekyk/stores";
import { showErrorAlert } from "@sidekyk/lib/error";
import { LoadArgs } from "@sidekyk/lib/types/conversation";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList } from "react-native";

type HeaderProps = {
	navigation: AppStackScreenProps<"Home">["navigation"];
	colors: ThemeType["colors"];
};

function Header({ navigation, colors }: HeaderProps) {
	const { top } = useSafeAreaInsets();
	return (
		<Box bg="bg" flexDirection="row" alignItems="center" justifyContent="space-between" px="container" pt={top} pb="base">
			<Heading color="text">Chats</Heading>
			<Box flexDirection="row" alignItems="center" px="sm">
				<HomeMenu navigation={navigation} accentColor={colors.primary} />
				<Box ml={20}>
					<LinkButton onPress={() => navigation.navigate("New Chat")}>
						<Ionicons name="create-outline" size={32} color={colors.primary} />
					</LinkButton>
				</Box>
			</Box>
		</Box>
	);
}

function NoConversations({ colors, height }: { colors: HeaderProps["colors"]; height: number }) {
	const { top } = useSafeAreaInsets();
	return (
		<Box height={height - top * 2.5} alignItems="center" justifyContent="center" px="container">
			<Text fontSize="lg" fontWeight={700}>
				No conversations yet...
			</Text>
			<Text color="alt.400" fontWeight={400} width="82%" textAlign="center" lineHeight="24px" mt="base">
				Tap on <Ionicons name="create-outline" size={20} color={colors.primary} /> to start a new chat and it will appear here.
			</Text>
		</Box>
	);
}

function HomeScreen({ navigation }: AppStackScreenProps<"Home">) {
	const {
		theme: { colors },
	} = useTheme();
	const { height } = useWindowDimensions();
	const userStore = useUserStore();

	const [conversations, setConversations] = useState<GetConversationResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [page, setPage] = useState({ current: 0, total: 0 });

	useEffect(() => {
		navigation.setOptions({
			headerShown: true,
			header: () => <Header colors={colors} navigation={navigation} />,
		});
	}, [navigation, colors]);

	useFocusEffect(
		useCallback(() => {
			(async () => await load({ reload: conversations.length > 0, showIndicator: conversations.length == 0 }))();
		}, [conversations.length])
	);

	function removeConversationFromList(conversationID: number) {
		setConversations((prev) => prev.filter((c) => c.conversation_id != conversationID));
	}

	const renderConversations = ({ item }: { item: GetConversationResponse; index: number }) => {
		return <ConversationCard conversation={item} navigation={navigation} colors={colors} userID={userStore.id} removeFromList={removeConversationFromList} />;
	};
	const memoizedRenderConversations = useCallback(renderConversations, [colors, navigation, userStore.id]);

	async function load({ reload, overrideCurrentPage, showIndicator }: Partial<LoadArgs> = { reload: false, showIndicator: true }) {
		const setLoadingState = showIndicator ? (reload ? (v: boolean) => setIsRefreshing(v) : (v: boolean) => setIsLoading(v)) : (_: boolean) => {};
		try {
			const pageToLoad = reload ? 1 : overrideCurrentPage || page.current + 1;
			const size = reload ? conversations?.length : 15;
			if (pageToLoad - 1 >= page.total && page.total > 0) return;
			setLoadingState(true);
			const res = await getConversations({ page: pageToLoad, size });
			if (page.total <= 0) setPage((prev) => ({ ...prev, total: res.total_pages }));
			setConversations(reload ? res.data : conversations.concat(res.data));
			if (!reload) setPage((prev) => ({ ...prev, current: pageToLoad })); // only increment page if not refreshing or reloading
		} catch (error) {
			showErrorAlert(error);
		} finally {
			setLoadingState(false);
		}
	}

	function extractKey(item: GetConversationResponse) {
		return `${item.sidekyk.sidekyk_id}_${item.conversation_id}_${item.created_at}`;
	}

	if (isLoading) {
		return (
			<SafeView forceInset={{ top: "never" }}>
				<Box flex={1} alignItems="center" justifyContent="center">
					<Spinner color="primary" />
				</Box>
			</SafeView>
		);
	}

	return (
		<SafeView forceInset={{ top: "never" }} avoidKeyboard>
			<Box flex={1} minHeight={height}>
				<FlatList
					data={conversations ?? []}
					keyExtractor={extractKey}
					renderItem={memoizedRenderConversations}
					ListEmptyComponent={<NoConversations colors={colors} height={height} />}
					ListFooterComponent={<Box height={250} />}
					refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => load({ reload: true, showIndicator: true })} tintColor={colors.primary} />}
					onEndReached={() => load({ overrideCurrentPage: page.current + 1 })}
					showsVerticalScrollIndicator={false}
				/>
			</Box>
		</SafeView>
	);
}

export default memo(HomeScreen);
