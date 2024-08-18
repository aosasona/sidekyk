import { Dispatch, SetStateAction } from "react";
import { Alert } from "react-native";
import { CustomApiResponse, UnwrappedError } from "../types/requests";
import { HTTPException, AppException } from "./error";
import * as Sentry from "@sentry/react-native";

const APP_EXCEPTIONS = ["AppException", "HTTPException"];
const VISIBLE_CLIENT_ERRORS = [400, 402, 403, 404, 406, 408, 409, 411, 412, 415, 422, 426, 428, 429, 403, 500, 502, 503, 504, 511];

// TODO: get rid of void
function unwrapHTTPError<T extends {} = any, U extends {} = T>(data: CustomApiResponse<T> | undefined | void): UnwrappedError<U> {
	if (data?.ok) return { error: null, errors: null, errType: "none" };

	let unwrappedError: UnwrappedError<U> = { error: "Something went wrong!", errors: null, errType: "fatal" };

	if (data?.status_code == 401) {
		return {
			error: null,
			errors: null,
			errType: "access_token_expired",
		};
	}

	const isVisibleError = VISIBLE_CLIENT_ERRORS.includes(data?.status_code ?? 0);

	if (!!data && isVisibleError) {
		if (data?.errors) {
			unwrappedError.error = null;
			unwrappedError.errors = data?.errors;
			unwrappedError.errType = "validation";
		}

		if (data?.error) {
			unwrappedError.error = data?.error;
		}

		if (data?.status_code == 428) unwrappedError.errType = "verification";
		if (data?.status_code == 429) unwrappedError.errType = "rate_limit";
	}

	return unwrappedError;
}

/** @throws {AppException, HTTPException, Error} */
function handleUnwrappedError<T extends {} = {}>(unwrappedError: UnwrappedError<T>, setErrors?: Dispatch<SetStateAction<Partial<T> | null>>): void {
	const { error, errors, errType } = unwrappedError;
	if (errType == "none") return;
	if (errType == "validation" || errors != null) {
		if (setErrors) setErrors(errors as T);
	}
	if (error != null) {
		throw new HTTPException(error);
	}
}

function getErrorMessage(err: Error) {
	let msg = "Oops, something went wrong";
	if (APP_EXCEPTIONS.includes(err.name)) {
		msg = err.message;
	}
	return msg;
}

type ErrorAlertArgs = {
	title?: string;
	log?: boolean;
};

export function logError(err: unknown) {
	// capture errors in sentry if it is not a custom error and app is not in development mode
	if (!__DEV__ && !APP_EXCEPTIONS.includes((err as Error).name)) {
		Sentry.captureException(err instanceof Error ? err : new Error(JSON.stringify(err)));
	}
}

function showErrorAlert(err: unknown, args: ErrorAlertArgs = { log: __DEV__ }) {
	if (__DEV__ && args.log) console.error(err);

	Alert.alert(args?.title ?? "An error occurred!", getErrorMessage(err as any));

	// capture errors in sentry if it is not a custom error and app is not in development mode
	if (!__DEV__ && !APP_EXCEPTIONS.includes((err as Error).name)) {
		Sentry.captureException(err instanceof Error ? err : new Error(JSON.stringify(err)));
	}
}

export { HTTPException, AppException, showErrorAlert, getErrorMessage, unwrapHTTPError, handleUnwrappedError, VISIBLE_CLIENT_ERRORS };
