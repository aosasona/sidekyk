import type { NullableObject } from "../errors";

export type ErrorReason = "none" | "validation" | "generic" | "fatal" | "verification" | "rate_limit" | "access_token_expired";

export type UnwrappedError<T extends NullableObject = null> = {
  error: string | null;
  errors: Record<keyof T, string> | null;
  errType: ErrorReason;
};
