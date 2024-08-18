export type ErrorReason = "none" | "validation" | "generic" | "fatal" | "verification" | "rate_limit" | "access_token_expired";

export type UnwrappedError<T extends {} = {}> = {
	error: string | null;
	errors: { [K in keyof T]?: string } | null;
	errType: ErrorReason;
};

export type CustomApiResponse<T = any, M extends {} = {}> = {
	ok: boolean;
	status_code: number;
	data: T;
	error?: string;
	errors?: any;
	meta?: M;
};

export type ResponseWithError<T extends {}, U extends {} = {}> = Partial<CustomApiResponse<T>> & Partial<UnwrappedError<U>>;

export enum RequestKeys {
	GetWhisperModels = 1,
}

export type ValidationErrors<T> = Partial<Record<keyof T, string>> | null;

export type RefreshTokenResponse = CustomApiResponse<{ access_token: string }>;
