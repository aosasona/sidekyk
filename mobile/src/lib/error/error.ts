class BaseError extends Error {
	constructor(message: string | null) {
		super(message ?? "");
		this.name = "BaseError";
	}
}

export class HTTPException extends BaseError {
	constructor(message: string | null) {
		super(message ?? "");
		this.name = "HTTPException";
	}
}

export class AppException extends BaseError {
	constructor(message: string | null) {
		super(message ?? "");
		this.name = "AppException";
	}
}
