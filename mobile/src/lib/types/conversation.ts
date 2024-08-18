import { GetConversationResponse, Message } from "./generated";

export type PaginationArgs = { page: number; size: number };
export type ResponseWithPagination<T> = { data: T[]; total_pages: number };

export type GetMessagesByConversationIDResponse = { data: Message[]; total_pages: number };
export type GetConversationsByUserResponse = { data: GetConversationResponse[]; total_pages: number };

export type LoadArgs = {
  reload: boolean;
  overrideCurrentPage: number;
  showIndicator?: boolean;
};
