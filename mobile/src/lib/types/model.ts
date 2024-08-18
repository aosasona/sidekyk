import { WhisperModels, GetUserResponse as User } from "./generated";

export type WhisperModel = WhisperModels;

export type WhisperModelAlias = "nano" | "standard" | "elite" | "precision" | "titan";

export type GPTModel = "gpt-3.5-turbo" | "gpt-3.5-turbo-16k" | "gpt-4" | "gpt-4-32k";
export type SubscriptionType = User["subscription_type"];
export type GPTModelsMapProperties = { alias: string; included_plans: SubscriptionType[] };
export type GPTModelsMap = Record<GPTModel, GPTModelsMapProperties>;
