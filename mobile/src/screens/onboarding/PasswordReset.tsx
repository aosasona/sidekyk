import { useEffect, useMemo, useState } from "react";
import { Box, SafeView, ScrollView, Input, Button, Divider, LinkButton, Text } from "@sidekyk/components";
import { ChangePasswordRequest } from "@sidekyk/lib/types/generated";
import { OnboardingStackScreenProps, SettingsStackScreenProps } from "@sidekyk/lib/types/navigation";
import { Switch, Case } from "@usmangurowa/react-switch";
import { PasswordResetSteps as Stage } from "@sidekyk/lib/types/auth";
import { ValidationErrors } from "@sidekyk/lib/types/requests";
import { validate } from "@sidekyk/lib/validation";
import { logError, showErrorAlert } from "@sidekyk/lib/error";
import { PasswordResetSchema } from "@sidekyk/lib/schemas/validation";
import { resetPassword, sendPasswordResetOTP, verifyPasswordResetOTP } from "@sidekyk/lib/requests/auth";

type ResetPasswordScreenProps = OnboardingStackScreenProps<"Reset Password"> | SettingsStackScreenProps<"Change Password">;

const validationGroups: Record<Stage, (keyof ChangePasswordRequest)[]> = {
	[Stage.Email]: ["email"],
	[Stage.OTP]: ["code"],
	[Stage.Password]: ["new_password", "confirm_password"],
};

function validateGroup(group: keyof typeof validationGroups, data: ChangePasswordRequest): ValidationErrors<ChangePasswordRequest> {
	const groupData = validationGroups[group].reduce((acc, key) => ({ ...acc, [key]: data[key] }), {});
	const groupValidator = PasswordResetSchema[group];

	try {
		return validate(groupData, groupValidator);
	} catch (e: unknown) {
		logError(e);
		return null;
	}
}

export default function PasswordResetScreen({ route, navigation }: ResetPasswordScreenProps) {
	const email = route?.params?.email;

	const [data, setData] = useState<ChangePasswordRequest>({
		email: email || "",
		new_password: "",
		confirm_password: "",
		code: "",
	});
	const [hasSentOTP, setHasSentOTP] = useState(false);
	const [resending, setResending] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<ChangePasswordRequest> | null>(null);
	const [stage, setStage] = useState<Stage>(email ? Stage.OTP : Stage.Email);
	const [countdown, setCountdown] = useState(60);

	const isChangePassword = useMemo(() => !!route?.params?.email, [route?.params]);

	useEffect(() => {
		if (!route?.params?.email) return;
		sendOTP({ email: route?.params.email, rethrow: true }).then().catch(showErrorAlert);
	}, [route?.params?.email]);

	useEffect(() => {
		if (!hasSentOTP) return;
		const timer = setInterval(() => {
			if (countdown > 0) {
				setCountdown(countdown - 1);
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [countdown, hasSentOTP]);

	function handleInputChange(key: keyof typeof data, value: string) {
		setErrors((prev) => ({ ...prev, [key]: null }));
		return setData((prev) => ({ ...prev, [key]: value }));
	}

	function goBack() {
		switch (stage) {
			case Stage.OTP:
				if (isChangePassword) return;
				setStage(Stage.Email);
				break;
			case Stage.Password:
				setStage(Stage.OTP);
				break;
		}
	}

	function handlePress() {
		try {
			setLoading(true);
			switch (stage) {
				case Stage.Email:
					const validationErrors = validateGroup(stage, data);
					if (validationErrors) return setErrors(validationErrors);
					sendOTP({ rethrow: true })
						.then(() => {
							setStage(Stage.OTP);
						})
						.catch(showErrorAlert);
					break;
				case Stage.OTP:
					setLoading(true);
					const otpValidationErrors = validateGroup(stage, data);
					if (otpValidationErrors) return setErrors(otpValidationErrors);
					verifyPasswordResetOTP({ email: data.email, code: data.code })
						.then(() => {
							setStage(Stage.Password);
						})
						.catch(showErrorAlert);
					break;
				case Stage.Password:
					setLoading(true);
					const passwordValidationErrors = validateGroup(stage, data);
					if (passwordValidationErrors) return setErrors(passwordValidationErrors);
					resetPassword(data)
						.then(() => {
							return navigation.goBack();
						})
						.catch(showErrorAlert);
			}
		} catch (e) {
			showErrorAlert(e);
		} finally {
			setLoading(false);
		}
	}

	async function sendOTP({ email, rethrow }: { email?: string; rethrow: boolean } = { rethrow: false }) {
		try {
			if (hasSentOTP) setResending(true);
			if (hasSentOTP && (countdown != 0 || loading || resending)) return;
			await sendPasswordResetOTP({ email: email ?? data.email });
			setCountdown(60);
		} catch (e) {
			if (rethrow) throw e;
			showErrorAlert(e);
		} finally {
			setResending(false);
			if (!hasSentOTP) setHasSentOTP(true);
		}
	}

	return (
		<SafeView forceInset={{ top: "never" }} isModal={isChangePassword} avoidKeyboard>
			<ScrollView flex={1} px="container" pt="lg">
				<Box>
					<Switch case={stage}>
						<Case when={Stage.Email}>
							<Input
								placeholder="john@doe.com"
								value={data.email}
								inputMode="email"
								textContentType="emailAddress"
								keyboardType="email-address"
								onChangeText={(v) => handleInputChange("email", v)}
								editable={!email}
								validationError={errors?.email}
							/>
						</Case>
						<Case when={Stage.OTP}>
							<Input
								id="otp"
								value={data.code}
								fontSize="5xl"
								placeholder="******"
								bg="transparent"
								borderBottomWidth={0}
								textAlign="center"
								fontWeight={800}
								keyboardType="numeric"
								maxLength={6}
								textContentType="oneTimeCode"
								letterSpacing={14}
								onChangeText={(v) => handleInputChange("code", v)}
								validationError={errors?.code}
								_focused={{ borderWidth: 0 }}
								style={{ backgroundColor: "transparent" }}
							/>
							{stage != Stage.Password ? (
								<Box alignItems="flex-end" mt="sm">
									<LinkButton color="primary" disabled={countdown != 0 && !resending} onPress={async () => await sendOTP()}>
										Resend OTP {countdown != 0 && hasSentOTP ? `(${countdown})` : null}
									</LinkButton>
								</Box>
							) : null}
						</Case>
						<Case when={Stage.Password}>
							<Box bg="alt.100" borderRadius={14} mb="base">
								<Input
									placeholder="New password"
									value={data.new_password}
									onChangeText={(v) => handleInputChange("new_password", v)}
									textContentType="newPassword"
									editable={!!data.code?.trim()}
									secureTextEntry={true}
									isFormGroup={true}
									validationError={errors?.new_password}
								/>
								<Divider />
								<Input
									placeholder="Confirm password"
									value={data.confirm_password}
									onChangeText={(v) => handleInputChange("confirm_password", v)}
									textContentType="newPassword"
									editable={!!data?.code?.trim()}
									secureTextEntry={true}
									isFormGroup={true}
									validationError={errors?.confirm_password}
								/>
							</Box>
						</Case>
					</Switch>
				</Box>
				<Box marginTop="xl">
					<Button onPress={handlePress} isLoading={loading || resending} mb="lg" enableHaptics>
						{stage == Stage.Email ? "Send OTP" : stage == Stage.OTP ? "Verify OTP" : isChangePassword ? "Change password" : "Reset password"}
					</Button>

					{(stage == Stage.OTP && !isChangePassword) || stage == Stage.Password ? (
						<LinkButton onPress={goBack} disabled={loading} enableHaptics>
							Go back
						</LinkButton>
					) : null}
				</Box>
			</ScrollView>
		</SafeView>
	);
}
