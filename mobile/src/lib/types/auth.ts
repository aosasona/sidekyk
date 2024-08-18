export enum STEPS {
	NAME = "name",
	EMAIL = "email",
	PASSWORD = "password",
}

export enum PasswordResetSteps {
	Email = "email",
	OTP = "otp",
	Password = "password",
}

export type SignUpData = {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	confirm_password: string;
};

export type ValidationErrors<T extends {}> = Partial<Record<keyof T, string>> | null;
