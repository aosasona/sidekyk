import { HTTPException, showErrorAlert, unwrapHTTPError } from "../error";
import { DeleteAccountRequest, GetUsageResponse, GetUserResponse, UpdateUserRequest } from "../types/generated";
import { CustomApiResponse } from "../types/requests";
import { api } from "./defaults";

export async function getUser(): Promise<GetUserResponse | null | void> {
	try {
		const res = await api.get<CustomApiResponse<GetUserResponse>>("/user");
		const { error } = unwrapHTTPError(res.data);
		if (error) {
			throw new HTTPException(error);
		}
		return res.data?.data || null;
	} catch (e) {
		return showErrorAlert(e);
	}
}

export async function updateUser(data: UpdateUserRequest): Promise<CustomApiResponse<UpdateUserRequest> | void> {
	const res = await api.patch<CustomApiResponse<UpdateUserRequest>>("/user", data);
	return res.data;
}

export async function deleteUser(opts: DeleteAccountRequest): Promise<CustomApiResponse<null> | void> {
	const res = await api.post<CustomApiResponse<null>>("/user/terminate", opts);
	return res.data;
}

export async function getUsage(): Promise<GetUsageResponse | null> {
	try {
		const res = await api.get<CustomApiResponse<GetUsageResponse>>("/user/usage");
		const { error } = unwrapHTTPError(res.data);
		if (error) {
			throw new HTTPException(error);
		}
		return res.data?.data || null;
	} catch (e) {
		showErrorAlert(e);
		return null;
	}
}
