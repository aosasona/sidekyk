import apisauce from "apisauce";
import useAuthStore from "@sidekyk/stores/auth";
import useOpenAIConfigStore from "@sidekyk/stores/oai";
import { getAccessToken } from "./token";
import { API_URL } from "../constants";

type ClientHeaders = {
	Authorization?: string;
	"x-openai-key"?: string;
	"x-override-model"?: string;
};

const unprotectedClient = apisauce.create({
	baseURL: API_URL,
});

const api = apisauce.create({
	baseURL: API_URL,
	timeout: 30000,
});

api.addAsyncRequestTransform(async function(request) {
	try {
		if (!request.url?.includes("auth")) {
			const accessToken = await getAccessToken();
			(request.headers as ClientHeaders)["Authorization"] = `Bearer ${accessToken}`;
		}
	} catch (e) {
		console.error(e);
	}
});
// add OpenAI and model to request
api.addAsyncRequestTransform(async function(request) {
	const oaiKey = useOpenAIConfigStore.getState().apiKey;
	const globalModel = useOpenAIConfigStore.getState().globalModel;
	if (!!oaiKey) {
		(request.headers as ClientHeaders)["x-openai-key"] = oaiKey;
		if (__DEV__) console.log("using OpenAI key");
	}
	if (!!globalModel) {
		(request.headers as ClientHeaders)["x-override-model"] = globalModel;
		if (__DEV__) console.log("using override model: ", globalModel);
	}
});

api.addResponseTransform(function(response) {
	try {
		if (response.status == 401 || response.status == 403) {
			useAuthStore.getState().signOut();
		}
	} catch (e) {
		console.error(e);
	} finally {
		return response;
	}
});

export { api, unprotectedClient, API_URL };
