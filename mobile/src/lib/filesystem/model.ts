import * as Filesystem from "expo-file-system";
import { WhisperModelAlias } from "../types/model";
import RNFS from "react-native-fs";

export const MODELS_FOLDER = Filesystem.documentDirectory + "models/";
export const RNFS_MODELS_FOLDER = RNFS.DocumentDirectoryPath + "/models";

export async function getDownloadedModels() {
	try {
		const models = await Filesystem.readDirectoryAsync(MODELS_FOLDER);
		return models?.filter((model) => model.endsWith(".en") || model.endsWith(".bin"));
	} catch (error) {
		return [];
	}
}

export async function makeModelsFolder() {
	try {
		await Filesystem.makeDirectoryAsync(MODELS_FOLDER, { intermediates: true });
	} catch (error) {
		console.error(error);
		return;
	}
}

export async function modelExists(name: WhisperModelAlias, ext: string = "en") {
	try {
		const models = await getDownloadedModels();
		return models?.includes(`${name}.${ext}`);
	} catch (error) {
		console.error(error);
		return;
	}
}

export async function deleteModel(name: WhisperModelAlias) {
	try {
		await Filesystem.deleteAsync(makeModelLocalUri(name));
	} catch (error) {
		console.error(error);
		return;
	}
}

export function makeModelLocalUri(name: WhisperModelAlias, ext: string = "en") {
	return `${MODELS_FOLDER}${name}.${ext}`;
}
