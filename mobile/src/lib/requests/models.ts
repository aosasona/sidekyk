import { WhisperModels as WhisperModel } from "@lib/types/generated";
import { CustomApiResponse } from "@lib/types/requests";
import { api } from "./defaults";
import { HTTPException, unwrapHTTPError } from "@lib/error";

type GetWhisperModelsResponse = CustomApiResponse<WhisperModel[]>;

export async function getWhisperModels(): Promise<WhisperModel[] | null> {
	const res = await api.get<GetWhisperModelsResponse>("/models/voice");

	const { error } = unwrapHTTPError(res.data);
	if (error) {
		throw new HTTPException(error);
	}

	return res.data?.data || null;
}
