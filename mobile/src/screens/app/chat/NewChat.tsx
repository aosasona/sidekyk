import { Box, Cancel, CustomPressable, SafeView, ScrollView, SearchInput, SidekykListItem, Spinner, Text } from "@sidekyk/components";
import { getSidekyks } from "@sidekyk/lib/requests/sidekyk";
import { GetSidekykResponse as Sidekyk } from "@sidekyk/lib/types/generated";
import { AppStackScreenProps } from "@sidekyk/lib/types/navigation";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { RefreshControl, useWindowDimensions } from "react-native";
import LottieView from "lottie-react-native";
import useSwr from "swr";
import useTheme from "@sidekyk/hooks/useTheme";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";

export default function NewChatScreen({ navigation }: AppStackScreenProps<"New Chat">) {
	const { theme } = useTheme();
	const { data, isLoading: isLoadingSidekyks, mutate } = useSwr("sidekyks", getSidekyks);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => <Cancel onPress={navigation.goBack} />,
			headerLeft: () => (
				<CustomPressable onPress={() => navigation.replace("Create Sidekyk")} enableHaptics>
					<Ionicons name="ios-add" size={26} color={theme?.colors?.primary} />
				</CustomPressable>
			),
		});
	}, []);

	const [refreshing, setRefreshing] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const searchResult = useMemo(() => {
		if (!data || !data?.sidekyks) {
			return [];
		}
		return data?.sidekyks.filter((sidekyk) => sidekyk.name.toLowerCase().includes(searchQuery.toLowerCase()));
	}, [searchQuery]);

	function handleRefresh() {
		try {
			setRefreshing(true);
			mutate();
		} catch (error) {
		} finally {
			setRefreshing(false);
		}
	}

	function renderItem({ item }: { item: Sidekyk }) {
		return <SidekykListItem sidekyk={item} theme={theme} navigation={navigation} onPress={() => navigation.replace("Conversation", { sidekyk: item })} mutate={mutate} />;
	}
	const memoizedRenderItem = useCallback(renderItem, []);

	if (isLoadingSidekyks) {
		return (
			<Box flex={1} bg="modal" alignItems="center" justifyContent="center">
				<Spinner usePrimaryColor />
			</Box>
		);
	}

	const hasNoDataToShow = !data || !data?.sidekyks || data?.sidekyks.length == 0 || (searchQuery.length > 0 && searchResult.length == 0);

	return (
		<SafeView forceInset={{ top: "never" }} avoidKeyboard isModal>
			<ScrollView flex={1} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
				<Box px="container" mt="md">
					<SearchInput value={searchQuery} onChange={setSearchQuery} />
				</Box>
				{hasNoDataToShow ? (
					<Box flex={1} minHeight={300} nobg>
						<EmptyList />
					</Box>
				) : (
					<Box minHeight={400} flex={1} mt="lg">
						<FlashList
							data={searchQuery?.length > 0 ? searchResult : data?.sidekyks}
							keyExtractor={(item) => `${item.name}-${item.personality_id}-${item.created_at}-${item.user_id}`}
							estimatedItemSize={120}
							renderItem={memoizedRenderItem}
							extraData={data?.sidekyks}
							ListEmptyComponent={EmptyList}
						/>
					</Box>
				)}
				<Box height={120} />
			</ScrollView>
		</SafeView>
	);
}

function EmptyList() {
	const { width } = useWindowDimensions();
	const size = width * 0.5;
	return (
		<Box flex={1} alignItems="center" justifyContent="center" px="base">
			<Box width={size} height={size} mb="sm">
				<LottieView source={require("../../../../assets/lottie/not-found.json")} autoPlay loop />
			</Box>
			<Text color="alt.500">Oops, no sidekicks to show...</Text>
		</Box>
	);
}
