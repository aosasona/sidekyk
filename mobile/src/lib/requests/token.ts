import useAuthStore, { REFRESH_TOKEN_KEY } from "@sidekyk/stores/auth";
import apisauce from "apisauce";
import * as SecureStore from "expo-secure-store";
import jwtDecode from "jwt-decode";
import { RefreshTokenResponse } from "../types/requests";
import { API_URL } from "../constants";

const client = apisauce.create({
  baseURL: API_URL,
});

export async function getAccessToken(): Promise<string> {
  let accessToken = useAuthStore.getState().accessToken;
  const decoded = jwtDecode<{ exp: number }>(accessToken);

  // check if token has expired (15 seconds before it expires, optimistic)
  if (decoded.exp * 1000 <= Date.now() + 1000 * 15) {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!!refreshToken) {
      const res = await client.post<RefreshTokenResponse>("/auth/token/refresh", {}, { headers: { Authorization: `Bearer ${refreshToken}` } });
      useAuthStore.getState().setAccessToken(res.data?.data?.access_token ?? "");
      accessToken = res.data?.data?.access_token ?? "";
    }
  }

  return accessToken;
}
