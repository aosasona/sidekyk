import { HTTPException, showErrorAlert, unwrapHTTPError } from "../error";
import { Avatar, GetSidekyksResponse, PersonalityMap } from "../types/generated";
import { CustomApiResponse } from "../types/requests";
import { api } from "./defaults";

export async function getAvatars(): Promise<Avatar[] | void> {
	try {
		const res = await api.get<CustomApiResponse<Avatar[]>>("/avatars");
		const { error } = unwrapHTTPError(res.data);
		if (error) {
			throw new HTTPException(error);
		}
		return res.data?.data;
	} catch (e) {
		return showErrorAlert(e);
	}
}

export async function getPersonalities(): Promise<PersonalityMap[] | void> {
	try {
		const res = await api.get<CustomApiResponse<PersonalityMap[]>>("/models/personalities");
		const { error } = unwrapHTTPError(res.data);
		if (error) {
			throw new HTTPException(error);
		}
		return res.data?.data;
	} catch (e) {
		return showErrorAlert(e);
	}
}

export async function getSidekyks(): Promise<GetSidekyksResponse | null> {
	try {
		const res = await api.get<CustomApiResponse<GetSidekyksResponse>>("/sidekyk");
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

export async function deleteSidekyk(id: number, cb: () => void): Promise<void> {
	try {
		const res = await api.delete<CustomApiResponse<{}>>(`/sidekyk/${id}`);
		const { error } = unwrapHTTPError(res.data);
		if (error) {
			throw new HTTPException(error);
		}
		cb();
	} catch (e) {
		showErrorAlert(e);
	}
}
