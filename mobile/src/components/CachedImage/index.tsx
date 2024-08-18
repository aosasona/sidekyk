import { MMKV } from "react-native-mmkv";
import { Image, ImageSource } from "expo-image";
import { ComponentPropsWithoutRef } from "react";

const store = new MMKV({
	id: "cached-images",
});

/**
 * @throws {Error} Invalid URL
 */
export function getCacheKey(url: string) {
	let sig = url
		?.replace(/(^\w+:|^)\/\//, "")
		?.replace(/\//g, "_")
		?.replace(/\./g, "_");
	// if there isn't a hash, try to get the last part of the URL
	if (!sig) sig = url?.split("/").pop()?.replace(/\./g, "_") ?? "";
	if (!sig) return "";
	return `img_${sig}`;
}

// type Props = ComponentPropsWithoutRef<typeof Image> & Record<string, unknown>;
//
// export default function CachedImage({ source, ...props }: Props) {
// 	let img;
//
// 	const key = getCacheKey(((source as ImageSource)?.uri as string) ?? (source as string) ?? "");
//
// 	if (store.getString(key)) {
// 		return <Image {...props} source={{ uri: img }} />;
// 	}
//
// 	return <Image {...props} source={source} />;
// }
