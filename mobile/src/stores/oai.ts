import { GPTModel } from "@sidekyk/lib/types/model";
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { logError } from "@sidekyk/lib/error";
import { ZustandSet } from "@sidekyk/lib/types/store";

type OpenAIConfigStore = {
	apiKey: string | "";
	globalModel: GPTModel | "";
	init: () => void;
	setApiKey: (apiKey: string) => void;
	setGlobalModel: (model: GPTModel) => void;
	removeApiKey: () => void;
};

const OAI_KEY = "openai-key";
const GLOBAL_OAI_MODEL = "global-oai-model";

const useOpenAIConfigStore = create<OpenAIConfigStore>((set) => ({
	apiKey: "",
	globalModel: "",
	init: () => init(set),
	setApiKey: (apiKey) => {
		setToStorage(OAI_KEY, apiKey);
		set({ apiKey });
	},
	setGlobalModel: (model) => {
		setToStorage(GLOBAL_OAI_MODEL, model);
		set({ globalModel: model });
	},
	removeApiKey: () => {
		deleteFromStorage(OAI_KEY);
		set({ apiKey: "" });
	},
}));

function init(set: ZustandSet<OpenAIConfigStore>) {
	getApiKeyFromStorage(set);
	getGlobalModelFromStorage(set);
}

function setToStorage(key: string, value: string) {
	SecureStore.setItemAsync(key, value).then().catch(logError);
}

function deleteFromStorage(key: string) {
	SecureStore.deleteItemAsync(key).then().catch(logError);
}

function getGlobalModelFromStorage(set: ZustandSet<OpenAIConfigStore>) {
	SecureStore.getItemAsync(GLOBAL_OAI_MODEL)
		.then((model) => {
			if (model) set({ globalModel: model as GPTModel });
		})
		.catch(logError);
}

function getApiKeyFromStorage(set: ZustandSet<OpenAIConfigStore>) {
	SecureStore.getItemAsync(OAI_KEY)
		.then((key) => {
			if (key) set({ apiKey: key });
		})
		.catch(logError);
}

export default useOpenAIConfigStore;
