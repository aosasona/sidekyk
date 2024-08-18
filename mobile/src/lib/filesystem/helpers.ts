import * as FileSystem from "expo-file-system";

type SizeType = "B" | "KB" | "MB" | "GB" | "TB";
type COnvertSizeArgs = {
	size: number;
	from: SizeType;
	to: SizeType;
	stringify?: boolean;
	decimalPlaces?: number;
};

export async function createFolderIfNotExists(path: string) {
	path = `${FileSystem.documentDirectory}${path}`;
	return FileSystem.getInfoAsync(path)
		.then(({ exists }) => {
			if (!exists) {
				return FileSystem.makeDirectoryAsync(path, { intermediates: true });
			}
		})
		.catch(console.error);
}

export function makeFSUri(name: string) {
	return `${FileSystem.documentDirectory}${name}`;
}

export function convertSize<T extends string | number = string>(args: COnvertSizeArgs): T {
	const { size, from, to } = args;
	const sizes: Record<SizeType, number> = {
		B: 1,
		KB: 1024,
		MB: 1024 * 1024,
		GB: 1024 * 1024 * 1024,
		TB: 1024 * 1024 * 1024 * 1024,
	};

	const result = (size * sizes[from]) / sizes[to];
	let val: T;
	let adjustedResult = result.toFixed(args.decimalPlaces || 2);

	val = parseFloat(adjustedResult) as T;
	if (args.stringify) {
		val = adjustedResult.toString() as T;
	}

	return val;
}

export async function getFreedeviceStorage(as: SizeType = "GB") {
	const freeStorage = await FileSystem.getFreeDiskStorageAsync();
	return convertSize<number>({ size: freeStorage, from: "B", to: as });
}
