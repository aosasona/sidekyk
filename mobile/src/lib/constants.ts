import { toast } from "burnt";
import { Platform } from "react-native";
import { GPTModelsMap, GPTModelsMapProperties } from "./types/model";

export const IS_ANDROID = Platform.OS == "android";
export const IS_IOS = Platform.OS == "ios";
export const OVERRIDE_ENABLE_LOCAL_WHISPER = false; // this disables the local whisper feature regardless of the user's settings
export const API_URL = "https://pa.sidekyk.app/api/v1";

export function comingSoon() {
	toast({
		title: "Coming Soon",
		preset: "none",
		duration: 1.5,
	});
}

export const GPT_Models: GPTModelsMap & { "": GPTModelsMapProperties } = {
	"": {
		alias: "Default",
		included_plans: ["FREE", "BASIC", "PRO", "OWN_KEY"],
	},
	"gpt-3.5-turbo": {
		alias: "GPT 3.5 turbo (4K context)",
		included_plans: ["FREE", "BASIC", "PRO", "OWN_KEY"],
	},
	"gpt-3.5-turbo-16k": {
		alias: "GPT 3.5 turbo (16K context)",
		included_plans: ["PRO", "OWN_KEY"],
	},
	"gpt-4": {
		alias: "GPT 4 (8K context)",
		included_plans: ["OWN_KEY"],
	},
	"gpt-4-32k": {
		alias: "GPT 4 (32K context)",
		included_plans: ["OWN_KEY"],
	},
};
