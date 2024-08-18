import qs from "qs";
import { AppException, HTTPException, showErrorAlert, unwrapHTTPError } from "../error";
import { PaginationArgs, ResponseWithPagination } from "../types/conversation";
import {
	ChangeConversationSettingsRequest,
	ChangeConversationSettingsResponse,
	ChangeConversationTitleResponse,
	ConversationSettings,
	DeleteConversationResponse,
	GetConversationResponse,
	PaginationMeta,
} from "../types/generated";
import { CustomApiResponse } from "../types/requests";
import { api } from "./defaults";

export async function getConversations({ page, size }: PaginationArgs = { page: 1, size: 15 }): Promise<ResponseWithPagination<GetConversationResponse>> {
	try {
		if (page < 1 || size <= 0) return { data: [], total_pages: 0 };
		const query = qs.stringify({ page, size, order: "DESC" });
		const res = await api.get<CustomApiResponse<GetConversationResponse[], PaginationMeta>>(`/conversations?${query}`);
		const { error } = unwrapHTTPError(res.data);
		if (error) {
			throw new HTTPException(error);
		}
		return { data: res.data?.data || [], total_pages: res.data?.meta?.total_pages || 0 };
	} catch (e) {
		showErrorAlert(e);
		return { data: [], total_pages: 0 };
	}
}

/**
 * @description Get conversations by sidekyk ID (handles error internally)
 */
export async function getConversationsBySidekykID(id: number, { page, size }: PaginationArgs = { page: 1, size: 15 }): Promise<ResponseWithPagination<GetConversationResponse>> {
	try {
		if (page < 1 || size <= 0) return { data: [], total_pages: 0 };
		const query = qs.stringify({ page, size, order: "DESC" });
		const res = await api.get<CustomApiResponse<GetConversationResponse[], PaginationMeta>>(`/conversations/sidekyk/${id}?${query}`);
		const { error } = unwrapHTTPError(res.data);
		if (error) {
			throw new HTTPException(error);
		}
		return { data: res.data?.data || [], total_pages: res.data?.meta?.total_pages || 0 };
	} catch (e) {
		showErrorAlert(e);
		return { data: [], total_pages: 0 };
	}
}

export async function getConversationSettings(conversationID: number): Promise<ConversationSettings | null> {
	try {
		const res = await api.get<CustomApiResponse<ConversationSettings>>(`/conversations/${conversationID}/settings`);
		const { error } = unwrapHTTPError(res.data);
		if (error) throw new HTTPException(error);
		return res.data?.data || null;
	} catch (error) {
		showErrorAlert(error);
		return null;
	}
}

export async function updateConversationSettings(conversationID: number, settings: ChangeConversationSettingsRequest): Promise<ChangeConversationSettingsResponse | null> {
	try {
		const res = await api.patch<CustomApiResponse<ChangeConversationSettingsResponse>>(`/conversations/${conversationID}/settings`, settings);
		const { error } = unwrapHTTPError(res.data);
		if (error) throw new HTTPException(error);
		return res.data?.data || null;
	} catch (error) {
		showErrorAlert(error);
		return null;
	}
}

export async function changeConversationSettings(conversationID: number, settings: ChangeConversationSettingsRequest): Promise<ChangeConversationSettingsResponse | null> {
	try {
		const res = await api.patch<CustomApiResponse<ChangeConversationSettingsResponse>>(`/conversations/${conversationID}/settings`, settings);
		const { error } = unwrapHTTPError(res.data);
		if (error) throw new HTTPException(error);
		return res.data?.data || null;
	} catch (error) {
		showErrorAlert(error);
		return null;
	}
}

export async function changeConversationTitle(conversationID: number, title: string): Promise<ChangeConversationTitleResponse> {
	try {
		const res = await api.patch<CustomApiResponse<ChangeConversationTitleResponse>>(`/conversations/${conversationID}`, { title });
		const { error, errors } = unwrapHTTPError(res.data);
		if (error) throw new HTTPException(error);
		if (errors) throw new AppException(`title ${errors.title}`);
		return { title: res.data?.data?.title || "" };
	} catch (e) {
		showErrorAlert(e);
		return { title: title };
	}
}

export async function deleteConversation(conversationID: number, cb?: () => void): Promise<void> {
	try {
		const res = await api.delete<CustomApiResponse<DeleteConversationResponse>>(`/conversations/${conversationID}`);
		const { error } = unwrapHTTPError(res.data);
		if (error) throw new HTTPException(error);
		if (cb) cb();
	} catch (e) {
		showErrorAlert(e);
	}
}
