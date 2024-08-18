import { useState } from "react";
import { Box, Button, Heading, Input, SafeView, Text, LinkButton } from "@sidekyk/components";
import Divider from "@sidekyk/components/Divider";
import { IS_ANDROID } from "@sidekyk/lib/constants";
import { HTTPException, showErrorAlert, unwrapHTTPError } from "@sidekyk/lib/error";
import { api } from "@sidekyk/lib/requests/defaults";
import { OnboardingStackScreenProps } from "@sidekyk/lib/types/navigation";
import { CustomApiResponse, ValidationErrors } from "@sidekyk/lib/types/requests";
import { useAuthStore } from "@sidekyk/stores";
import { validateWithCallback } from "@sidekyk/lib/validation";
import { SignInSchema } from "@sidekyk/lib/schemas/validation";

type SignInResponse = {
	access_token: string;
	refresh_token: string;
};

export default function SignInScreen({ navigation }: OnboardingStackScreenProps<"SignIn">) {
	const authStore = useAuthStore();

	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState<ValidationErrors<typeof data>>(null);

	function handleInputChange(key: keyof typeof data, value: string) {
		setErrors((prev) => ({ ...prev, [key]: "" }));
		return setData((prev) => ({ ...prev, [key]: value }));
	}

	async function signIn() {
		try {
			validateWithCallback(data, SignInSchema, async (errors, hasError) => {
				if (hasError) return setErrors(errors);

				try {
					setLoading(true);
					setErrors(null);

					const response = await api.post<CustomApiResponse<SignInResponse>>("/auth/signin", data);

					if (!response.ok) {
						const { error, errors, errType } = unwrapHTTPError<any, typeof data>(response.data);
						if (errors || errType == "validation") {
							return setErrors(errors);
						}
						if (errType == "verification") {
							return navigation.push("VerifyEmail", { email: data.email });
						}
						if (error && !errors) {
							throw new HTTPException(error);
						}
					}

					const tokens = response.data?.data;
					if (!tokens?.access_token || !tokens.refresh_token) {
						throw new HTTPException("Something went wrong, please sign in again");
					}

					return authStore.signIn({
						accessToken: tokens?.access_token,
						refreshToken: tokens?.refresh_token,
					});
				} catch (e) {
					showErrorAlert(e);
				} finally {
					setLoading(false);
				}
			});
		} catch (e) {
			showErrorAlert(e);
		}
	}

	return (
		<SafeView avoidKeyboard>
			<Box flex={1} px="container" nobg>
				<Box flex={1} mt="xl" nobg>
					<Box mb={24} nobg>
						<Heading color="text" fontSize="3xl" fontWeight={IS_ANDROID ? 700 : 600}>
							Sign In
						</Heading>
						<Text color="alt.400" fontWeight={500} mt="base">
							Enter your credentials to sign in to your account
						</Text>
					</Box>

					<Box bg="alt.100" borderRadius={14}>
						<Input
							value={data.email}
							onChangeText={(val) => handleInputChange("email", val)}
							keyboardType="email-address"
							textContentType="emailAddress"
							placeholder="ayo@wyte.space"
							validationError={errors?.email}
							isFormGroup
						/>
						<Divider />
						<Input
							value={data.password}
							onChangeText={(val) => handleInputChange("password", val)}
							keyboardType="default"
							textContentType="password"
							placeholder="******"
							validationError={errors?.password}
							secureTextEntry
							isFormGroup
						/>
					</Box>

					<Box alignItems="flex-end" mt="base">
						<LinkButton onPress={() => navigation.push("Reset Password", {})} px={9}>
							Forgot password?
						</LinkButton>
					</Box>
				</Box>

				<Box pt="lg" pb="sm">
					<Button onPress={async () => await signIn()} isLoading={loading} enableHaptics>
						Continue
					</Button>
					<Box py={IS_ANDROID ? "base" : "sm"}>
						<LinkButton onPress={() => navigation.replace("SignUp")}>I don't have an account yet</LinkButton>
					</Box>
				</Box>
			</Box>
		</SafeView>
	);
}
