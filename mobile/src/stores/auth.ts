import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import apisauce from "apisauce";
import * as SecureStore from "expo-secure-store";
import * as Sentry from "@sentry/react-native";

export const REFRESH_TOKEN_KEY = "refreshToken";

type AuthStore = {
	accessToken: string;
	setAccessToken: (t: string) => void;
	getAccessToken: () => string; // getters for non-component usage
	getRefreshToken: () => Promise<string | null>;
	isLoggedIn: () => Promise<boolean>;
	signIn: (tokens: { accessToken: string; refreshToken: string }) => void;
	signOut: () => Promise<void>;
};

const storage = new MMKV();

export const persistentStore: StateStorage = {
	setItem: (key, value) => storage.set(key, value),
	getItem: (key) => storage.getString(key) ?? null,
	removeItem: (key) => storage.delete(key),
};

const useAuthStore = create(
	persist<AuthStore>(
		(set, get) => ({
			accessToken: "",
			getAccessToken: () => get().accessToken,
			getRefreshToken: async () => await getRefreshToken(),
			setAccessToken: (token) => set({ accessToken: token }),
			isLoggedIn: async () => {
				const refreshToken = await getRefreshToken();
				return !!get().accessToken && !!refreshToken;
			},
			signIn: (tokens) => {
				(async () => await setRefreshToken(tokens.refreshToken))();
				set({ accessToken: tokens.accessToken });
			},
			signOut: async () => {
				try {
					const refreshToken = await getRefreshToken();
					signOut(get().accessToken, refreshToken).then().catch(console.error);
					set({ accessToken: "" });
					(async () => await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY))();
				} catch (e) {
					Sentry.captureException(e);
					console.error(e);
				}
			},
		}),
		{
			name: "auth-store",
			storage: createJSONStorage(() => persistentStore),
		}
	)
);

async function getRefreshToken() {
	try {
		return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
	} catch (e) {
		console.error(e);
		return null;
	}
}

async function setRefreshToken(token: string) {
	return await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

async function signOut(accessToken: string, refreshToken: string | null) {
	try {
		await apisauce.create({ baseURL: "https://pa.sidekyk.app/api/v1" }).post(
			"/auth/signout",
			{
				refresh_token: refreshToken,
			},
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
	} catch (e) {
		console.error(e);
	}
}

export default useAuthStore;
