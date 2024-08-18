import { FlashList } from "@shopify/flash-list";
import { Avatar } from "@sidekyk/lib/types/generated";
import { Fragment, memo, useCallback, useMemo } from "react";
import { useWindowDimensions } from "react-native";
import Box from "../Box";
import { getCacheKey } from "../CachedImage";
import CustomPressable from "../CustomPressable";
import { Image } from "expo-image";
import { Label } from "../Text";

type AppearanceProps = {
	segment: number;
	selectedAvatar: Avatar | null;
	selectedSegment: number;
	avatars: Avatar[];
	setSelectedAvatar: (avatar: Avatar | null) => void;
};

function Appearance({ selectedAvatar, avatars, setSelectedAvatar }: AppearanceProps) {
	const { width } = useWindowDimensions();

	function renderAvatar({ item: avatar, index }: { item: Avatar; index: number }) {
		const selected = selectedAvatar && selectedAvatar?.name == avatar.name;
		const cacheKey = getCacheKey(avatar.url ?? "");
		return (
			<CustomPressable onPress={() => setSelectedAvatar(avatar)}>
				<Box borderRadius={999} backgroundColor={selected ? "alt.100" : "transparent"} ml={index == 0 ? 18 : 10} mr={avatars && index == avatars?.length - 1 ? 18 : 0} p="lg">
					<Image source={{ uri: avatar.url, cacheKey }} transition={150} style={{ width: 72, height: 72 }} />
				</Box>
			</CustomPressable>
		);
	}

	const numColumns = useMemo(() => Math.floor(width / (72 + 32)), [width]);

	const memoizedRenderAvatar = useCallback(renderAvatar, [selectedAvatar]);
	return (
		<Fragment>
			<Box mb="base">
				<Label>Avatar</Label>
			</Box>
			<Box minHeight={480} flex={1} mb="2xl">
				<FlashList
					data={avatars ?? []}
					keyExtractor={(item, idx) => `${item.name}-${idx}-${item.size}`}
					renderItem={memoizedRenderAvatar}
					estimatedItemSize={24}
					showsHorizontalScrollIndicator={false}
					numColumns={numColumns}
					extraData={selectedAvatar}
				/>
			</Box>
		</Fragment>
	);
}

export default memo(Appearance);
