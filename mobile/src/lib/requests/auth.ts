import { HTTPException, unwrapHTTPError } from "../error";
import { ChangePasswordRequest, VerifyPasswordResetOTP } from "../types/generated";
import { CustomApiResponse } from "../types/requests";
import { api } from "./defaults";

// No errors returned or thrown means it all went okay

type VerifyOTPData = {
	email: string;
	code: string;
};

type ResendOTPData = Pick<VerifyOTPData, "email">;

type OTPErrorResponse = { errors: { [K in keyof VerifyOTPData]?: string } };

export async function verifyOTP(data: VerifyOTPData): Promise<OTPErrorResponse | null> {
	const response = await api.post<CustomApiResponse<{}>>("/auth/otp/verify", data);

	if (!response.ok) {
		const { error, errors } = unwrapHTTPError<any, VerifyOTPData>(response.data);
		if (errors) {
			return { errors };
		} else if (error) {
			throw new HTTPException(error);
		}
	}

	return null;
}

export async function resendOTP(data: ResendOTPData): Promise<OTPErrorResponse | null> {
	const response = await api.post<CustomApiResponse<{}>>("/auth/otp/resend", data);

	if (!response.ok) {
		const { error, errType } = unwrapHTTPError<any, VerifyOTPData>(response.data);
		if (errType == "validation") {
			throw new HTTPException("one or more fields are invalid");
		} else if (error) {
			throw new HTTPException(error);
		}
	}

	return null;
}

type SendPasswordResetOTP = { email: string };

export async function sendPasswordResetOTP(data: SendPasswordResetOTP): Promise<void> {
	const response = await api.post<CustomApiResponse<SendPasswordResetOTP>>("/auth/password/request-otp", data);
	if (!response.ok) {
		const { error } = unwrapHTTPError<SendPasswordResetOTP, SendPasswordResetOTP>(response.data);
		if (error) {
			throw new HTTPException(error);
		}
	}
}

export async function verifyPasswordResetOTP(data: VerifyPasswordResetOTP): Promise<void> {
	const response = await api.post<CustomApiResponse<SendPasswordResetOTP>>("/auth/password/verify-otp", data);
	if (!response.ok) {
		const { error } = unwrapHTTPError<SendPasswordResetOTP, SendPasswordResetOTP>(response.data);
		if (error) {
			throw new HTTPException(error);
		}
	}
}

export async function resetPassword(data: ChangePasswordRequest): Promise<void> {
	const response = await api.post<CustomApiResponse<SendPasswordResetOTP>>("/auth/password/reset", data);
	if (!response.ok) {
		const { error } = unwrapHTTPError<SendPasswordResetOTP, SendPasswordResetOTP>(response.data);
		if (error) {
			throw new HTTPException(error);
		}
	}
}
