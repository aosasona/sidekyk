import Box, { BoxProps } from "../Box";
import { Image } from "expo-image";
import { memo, useMemo } from "react";
import { getCacheKey } from "../CachedImage";

type Props = BoxProps & {
	size?: number;
	bg?: string;
	uri: string | null | undefined;
	padding?: number;
};

function ProfileImage({ size = 75, bg = "#e5e5e5", uri, padding = 24, ...props }: Props) {
	const totalSize = useMemo(() => size + padding, [size, padding]);
	const cacheKey = getCacheKey(uri ?? "");

	return (
		<Box {...props} height={totalSize} width={totalSize} bg={bg} alignItems="center" justifyContent="center" borderRadius={9999}>
			{uri ? <Image source={{ uri: uri, cacheKey: cacheKey }} transition={150} style={{ width: size, aspectRatio: 1 }} /> : null}
		</Box>
	);
}

export default memo(ProfileImage);
