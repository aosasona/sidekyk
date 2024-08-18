import { AppException, showErrorAlert } from "./error";
import * as Updates from "expo-updates";
import { Alert } from "react-native";
import { useConfigStore } from "@sidekyk/stores";
import { updateId } from "expo-updates";

export async function checkForUpdateOnAppLoad(showError = false) {
	try {
		if (__DEV__) return;
		const hasUpdate = await fetchUpdateAsync();
		if (hasUpdate) {
			Alert.alert("Update available", "An update is available, do you want to download and install it now?", [
				{
					text: "No",
					style: "cancel",
				},
				{
					text: "Yes",
					onPress: async () => await downloadUpdate(),
				},
			]);
			return;
		}

		if (showError && !hasUpdate) {
			return Alert.alert("No update available", "You are already on the latest version");
		}
	} catch (e) {
		if (showError) {
			showErrorAlert(new AppException("Failed to check for update"));
		}
	}
}

export async function fetchUpdateAsync(): Promise<boolean> {
	try {
		const update = await Updates.checkForUpdateAsync();
		const lastUpdateID = useConfigStore.getState().lastUpdateID;
		if (update.isAvailable && updateId && lastUpdateID && updateId === lastUpdateID) {
			return false;
		}
		return update.isAvailable;
	} catch (e) {
		showErrorAlert(e);
		return false;
	}
}

export async function downloadUpdate() {
	try {
		const configStore = useConfigStore.getState();
		if (updateId) configStore.setLastUpdateID(updateId);
		await Updates.reloadAsync();
	} catch (e) {
		showErrorAlert(e);
	}
}
