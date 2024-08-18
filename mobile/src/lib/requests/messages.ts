import qs from "qs";
import { HTTPException, showErrorAlert, unwrapHTTPError } from "../error";
import { PaginationArgs, ResponseWithPagination } from "../types/conversation";
import { Message, PaginationMeta, SendMessageRequest, SendMessageResponse } from "../types/generated";
import { CustomApiResponse } from "../types/requests";
import { api } from "./defaults";

export async function sendTextMessage(req: SendMessageRequest): Promise<CustomApiResponse<SendMessageResponse> | undefined | void> {
	const res = await api.post<CustomApiResponse<SendMessageResponse>>("/messages", req);
	return res.data;
}

export async function getMessagesByConversationID(conversationID: number, { page, size }: PaginationArgs = { page: 1, size: 10 }): Promise<ResponseWithPagination<Message>> {
	try {
		if (page < 1 || size <= 0) return { data: [], total_pages: 0 };
		const query = qs.stringify({ page, size, order: "DESC" });
		const res = await api.get<CustomApiResponse<Message[], PaginationMeta>>(`/messages/${conversationID}?${query}`);
		const { error } = unwrapHTTPError(res.data);
		if (error) {
			throw new HTTPException(error);
		}
		return {
			data: res.data?.data || [],
			total_pages: res.data?.meta?.total_pages || 0,
		};
	} catch (e) {
		showErrorAlert(e);
		return { data: [], total_pages: 0 };
	}
}
