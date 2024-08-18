import { PasswordResetSteps, STEPS } from "../types/auth";

const _nameSchema = {
	type: "string",
	presence: true,
	format: {
		pattern: /^[a-zA-Z]+$/,
		message: "can only contain letters",
		flags: "i",
	},
	length: {
		minimum: 3,
		maximum: 32,
	},
};

const _passwordSchema = {
	type: "string",
	presence: true,
	length: {
		minimum: 6,
		maximum: 24,
	},
};

export const SignUpSchema = {
	[STEPS.NAME]: {
		first_name: _nameSchema,
		last_name: _nameSchema,
	},

	[STEPS.EMAIL]: {
		email: {
			type: "string",
			presence: true,
			email: true,
		},
	},

	[STEPS.PASSWORD]: {
		password: _passwordSchema,
		confirm_password: {
			..._passwordSchema,
			equality: "password",
		},
	},
};

export const SignInSchema = {
	email: {
		type: "string",
		presence: true,
		email: true,
	},
	password: _passwordSchema,
};

export const PasswordResetSchema = {
	[PasswordResetSteps.Email]: {
		email: {
			type: "string",
			presence: true,
			email: true,
		},
	},
	[PasswordResetSteps.OTP]: {
		code: {
			type: "string",
			presence: true,
			length: {
				minimum: 6,
				maximum: 6,
			},
			format: {
				pattern: /^[0-9]+$/,
				message: "can only contain numbers",
				flags: "i",
			},
		},
	},

	[PasswordResetSteps.Password]: {
		new_password: _passwordSchema,
		confirm_password: {
			..._passwordSchema,
			equality: "new_password",
		},
	},
};
