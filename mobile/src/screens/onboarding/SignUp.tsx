import { useState } from "react";
import { Box, Button, Heading, Input, SafeView, Text, LinkButton, Divider, ScrollView, Back } from "@sidekyk/components";
import { IS_ANDROID } from "@sidekyk/lib/constants";
import { api } from "@sidekyk/lib/requests/defaults";
import { HTTPException, logError, showErrorAlert, unwrapHTTPError } from "@sidekyk/lib/error";
import { OnboardingStackScreenProps } from "@sidekyk/lib/types/navigation";
import { SignUpData, STEPS, ValidationErrors } from "@sidekyk/lib/types/auth";
import { SignUpSchema } from "@sidekyk/lib/schemas/validation";
import { validate } from "@sidekyk/lib/validation";

const validationGroups: Record<STEPS, (keyof SignUpData)[]> = {
	[STEPS.NAME]: ["first_name", "last_name"],
	[STEPS.EMAIL]: ["email"],
	[STEPS.PASSWORD]: ["password", "confirm_password"],
};

function validateGroup(group: keyof typeof validationGroups, data: SignUpData): ValidationErrors<SignUpData> {
	const groupData = validationGroups[group].reduce((acc, key) => ({ ...acc, [key]: data[key] }), {});
	const groupValidator = SignUpSchema[group];

	try {
		return validate(groupData, groupValidator);
	} catch (e: unknown) {
		logError(e);
		return null;
	}
}

export default function SignUpScreen({ navigation }: OnboardingStackScreenProps<"SignUp">) {
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState<STEPS>(STEPS.NAME);
	const [data, setData] = useState<SignUpData>({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		confirm_password: "",
	});
	const [errors, setErrors] = useState<ValidationErrors<SignUpData>>(null);

	function goBack() {
		switch (step) {
			case STEPS.EMAIL:
				setStep(STEPS.NAME);
				break;

			case STEPS.PASSWORD:
				setStep(STEPS.EMAIL);
				break;
		}
	}

	async function continueSignUp() {
		setErrors(null);
		switch (step) {
			case STEPS.NAME:
				const nameErrors = validateGroup(STEPS.NAME, data);
				if (nameErrors) return setErrors(nameErrors);
				setStep(STEPS.EMAIL);
				break;

			case STEPS.EMAIL:
				const emailErrors = validateGroup(STEPS.EMAIL, data);
				if (emailErrors) return setErrors(emailErrors);
				setStep(STEPS.PASSWORD);
				break;

			case STEPS.PASSWORD:
				const passwordErrors = validateGroup(STEPS.PASSWORD, data);
				if (passwordErrors) return setErrors(passwordErrors);
				await signUp();
				break;
		}
	}

	function handleInputChange(key: keyof typeof data, value: string) {
		setErrors((prev) => ({ ...prev, [key]: "" }));
		return setData((prev) => ({ ...prev, [key]: value?.trim() }));
	}

	async function signUp() {
		try {
			setLoading(true);
			setErrors(null);
			const response = await api.post<any>("/auth/signup", data);

			if (!response.ok) {
				const { error, errors, errType } = unwrapHTTPError<any, typeof data>(response.data);
				if (errors || errType == "validation") {
					setErrors(errors);
				}
				if (error) {
					throw new HTTPException(error);
				}
			}

			navigation.replace("VerifyEmail", { email: data.email });
		} catch (e) {
			showErrorAlert(e);
		} finally {
			setLoading(false);
		}
	}

	return (
		<SafeView avoidKeyboard>
			<Box flex={1} px="container">
				<Box flex={1}>
					{step !== STEPS.NAME ? (
						<Box alignItems="flex-start" mt="md" mb="lg">
							<Back onPress={goBack} />
						</Box>
					) : null}

					{step == STEPS.NAME ? (
						<Box>
							<Box mb="xl" mt="xl">
								<Heading fontSize="3xl" color="text" fontWeight={IS_ANDROID ? 800 : 700}>
									So...
								</Heading>
								<Text color="alt.400" fontWeight={500} mt="base">
									What do we call you?
								</Text>
							</Box>

							<Box bg="alt.100" borderRadius={14}>
								<Input
									value={data.first_name}
									onChangeText={(val) => handleInputChange("first_name", val)}
									inputMode="text"
									keyboardType="ascii-capable"
									textContentType="givenName"
									placeholder="First name"
									validationError={errors?.first_name}
									isFormGroup
								/>
								<Divider />
								<Input
									value={data.last_name}
									onChangeText={(val) => handleInputChange("last_name", val)}
									inputMode="text"
									keyboardType="ascii-capable"
									textContentType="familyName"
									placeholder="Last name"
									validationError={errors?.last_name}
									isFormGroup
								/>
							</Box>
						</Box>
					) : step == STEPS.EMAIL ? (
						<Box>
							<Box mb={24}>
								<Heading fontSize="3xl" color="text" fontWeight={IS_ANDROID ? 800 : 700}>
									'You human? 🧐
								</Heading>
								<Text color="alt.400" fontWeight={500} mt="base">
									Where can we send you an e-mail right now?
								</Text>
							</Box>

							<Box>
								<Input
									inputMode="email"
									value={data.email}
									onChangeText={(val) => handleInputChange("email", val)}
									keyboardType="email-address"
									textContentType="emailAddress"
									placeholder="Email address"
									validationError={errors?.email}
								/>
							</Box>
						</Box>
					) : (
						<Box>
							<Box mb={24}>
								<Heading fontSize="3xl" color="text" fontWeight={IS_ANDROID ? 800 : 700}>
									One last thing...
								</Heading>
								<Text color="alt.400" fontWeight={500} mt="base" lineHeight="25px">
									Type in a secure password to protect your account... and then type it in again to be sure
								</Text>
							</Box>

							<Box bg="alt.100" borderRadius={14}>
								<Input
									value={data.password}
									onChangeText={(val) => handleInputChange("password", val)}
									keyboardType="default"
									textContentType="password"
									placeholder="Password"
									validationError={errors?.password}
									isFormGroup={true}
									secureTextEntry={true}
								/>
								<Divider />
								<Input
									value={data.confirm_password}
									onChangeText={(val) => handleInputChange("confirm_password", val)}
									keyboardType="default"
									textContentType="password"
									placeholder="Confirm password"
									validationError={errors?.confirm_password}
									isFormGroup={true}
									secureTextEntry={true}
								/>
							</Box>
						</Box>
					)}
				</Box>

				<Box py="lg" pb={0}>
					<Button onPress={async () => continueSignUp()} isLoading={loading} enableHaptics>
						Continue
					</Button>
					<Box my="base">
						<LinkButton onPress={() => navigation.replace("SignIn")}>I already have an account</LinkButton>
					</Box>
				</Box>
			</Box>
		</SafeView>
	);
}
