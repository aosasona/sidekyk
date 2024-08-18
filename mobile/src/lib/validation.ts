import validation from "validate.js";
import { ValidationErrors } from "./types/auth";

type ValidationCallback<T extends {}> = (errors: ValidationErrors<T>, hasError: boolean) => Promise<void> | void;

export function validate<T extends {}>(data: T, schema: Record<keyof T, any>): ValidationErrors<T> {
	const result = validation(data, schema);
	if (result) {
		const errors: ValidationErrors<T> = {};
		for (const key in result) {
			errors[key as keyof T] = result?.[key]?.[0];
		}
		return errors;
	}
	return null;
}

export function validateWithCallback<T extends {}>(data: T, schema: Record<keyof T, any>, callback: ValidationCallback<T>): void {
	const errors = validate(data, schema);
	const hasError = !!errors && Object.keys(errors).length > 0;
	callback(errors, hasError);
}
