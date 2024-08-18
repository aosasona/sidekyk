import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { AppTheme } from "@lib/types/theme";
import { WhisperModelAlias } from "@sidekyk/lib/types/model";
import { ZustandSet } from "@sidekyk/lib/types/store";
import { PRIMARY_COLOR } from "@sidekyk/theme";

type HexColor = `#${string}`;

export type ChatDisplayMode = "bubble" | "list";

export type ConfigStore = {
	theme: AppTheme;
	accentColor: HexColor;
	useDeviceTheme: boolean;
	useDeviceTranscription: boolean;
	alwaysListen: boolean;
	selectedWhisperModel: WhisperModelAlias | null;
	sendMessageImmediately: boolean;
	allowExperimentalWhisper: boolean;
	lastUpdateID: string | null;
	chatDisplayMode: ChatDisplayMode;
	setChatDisplayMode: (mode: ChatDisplayMode) => void;
	setAccentColor: (color: HexColor) => void;
	setWhisperModel: (model: WhisperModelAlias) => void;
	setTheme: (theme: AppTheme) => void;
	setLastUpdateID: (id: string) => void;
	toggleTheme: () => void;
	toggleAlwaysListen: (value: boolean) => void;
	toggleUseDeviceTheme: (value?: boolean) => void;
	toggleSendMessageImmediately: () => void;
	toggleAllowExperimentalWhisper: () => void;
	changeTranscriptionMethod: (value: WhisperModelAlias | boolean) => void;
};

const storage = new MMKV();

const configStorage: StateStorage = {
	setItem: (key, value) => storage.set(key, value),
	getItem: (key) => storage.getString(key) ?? null,
	removeItem: (key) => storage.delete(key),
};

const useConfigStore = create(
	persist<ConfigStore>(
		(set, get) => ({
			theme: "light",
			chatDisplayMode: "bubble",
			accentColor: PRIMARY_COLOR,
			useDeviceTheme: false,
			alwaysListen: false,
			useDeviceTranscription: true,
			selectedWhisperModel: null,
			sendMessageImmediately: false,
			allowExperimentalWhisper: false,
			lastUpdateID: null,
			setChatDisplayMode: (mode: ChatDisplayMode) => set({ chatDisplayMode: mode }),
			setAccentColor: (color: HexColor) => set({ accentColor: color }),
			setWhisperModel: (model: WhisperModelAlias) => set({ selectedWhisperModel: model }),
			setLastUpdateID: (id: string) => set({ lastUpdateID: id }),
			toggleUseDeviceTranscription: () => set({ useDeviceTranscription: !get().useDeviceTranscription }),
			setTheme: (theme: AppTheme) => set({ theme }),
			toggleTheme: () => set({ theme: get().theme == "dark" ? "light" : "dark", useDeviceTheme: false }),
			toggleAlwaysListen: (value: boolean) => set({ alwaysListen: value }),
			toggleUseDeviceTheme: (value) => set({ useDeviceTheme: value ?? !get().useDeviceTheme }),
			toggleSendMessageImmediately: () => set({ sendMessageImmediately: !get().sendMessageImmediately }),
			toggleAllowExperimentalWhisper: () => set((state) => ({ allowExperimentalWhisper: !state.allowExperimentalWhisper })),
			changeTranscriptionMethod: (value: WhisperModelAlias | boolean) => changeTranscriptionMethod(value, { set }),
		}),
		{
			name: "config-store",
			storage: createJSONStorage(() => configStorage),
		}
	)
);

function changeTranscriptionMethod(value: WhisperModelAlias | boolean, state: { set: ZustandSet<ConfigStore> }) {
	if (typeof value == "boolean") {
		return state.set({ useDeviceTranscription: value, selectedWhisperModel: null });
	}

	return state.set({ useDeviceTranscription: false, selectedWhisperModel: value });
}

export default useConfigStore;
