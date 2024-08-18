import { Box, Input, LinkButton, SafeView, Text, Spinner } from "@sidekyk/components";
import { OnboardingStackScreenProps } from "@sidekyk/lib/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import colors from "@sidekyk/theme/colors";
import { useEffect, useState } from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Keyboard } from "react-native";
import { showErrorAlert } from "@sidekyk/lib/error";
import { resendOTP, verifyOTP } from "@sidekyk/lib/requests/auth";

export default function EmailVerificationScreen({ navigation, route }: OnboardingStackScreenProps<"VerifyEmail">) {
	let { email } = route.params;
	email = email.toLowerCase();

	const [resending, setResending] = useState(false);
	const [verifying, setVerifying] = useState(false);
	const [OTP, setOTP] = useState("");
	const [errors, setErrors] = useState({
		email: "",
		code: "",
	});
	const [countdown, setCountdown] = useState(60);

	useEffect(() => {
		const timer = setInterval(() => {
			if (countdown > 0) {
				setCountdown(countdown - 1);
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [countdown]);

	useEffect(() => {
		if (OTP.length == 6) {
			(async () => await verify())();
		}
	}, [OTP]);

	async function verify() {
		try {
			setVerifying(true);
			const res = await verifyOTP({ email, code: OTP });
			if (res?.errors) {
				return setErrors({ email: res.errors.email || "", code: res.errors.code || "" });
			}
			return navigation.navigate("SignIn");
		} catch (e) {
			showErrorAlert(e);
		} finally {
			setVerifying(false);
		}
	}

	async function resend() {
		try {
			setResending(true);
			const res = await resendOTP({ email });
			if (res?.errors) {
				return setErrors({ email: res.errors.email || "", code: res.errors.code || "" });
			}
			setCountdown(60);
		} catch (e) {
			showErrorAlert(e);
		} finally {
			setResending(false);
		}
	}

	return (
		<SafeView forceInset={{ top: "never" }} avoidKeyboard>
			<Box flex={1} px="container">
				<Box mt="base">
					{verifying ? (
						<Box my="lg">
							<Spinner />
						</Box>
					) : (
						<Input
							value={OTP}
							fontSize="5xl"
							placeholder="******"
							textContentType="oneTimeCode"
							backgroundColor="transparent"
							borderBottomWidth={0}
							textAlign="center"
							fontWeight={800}
							keyboardType="number-pad"
							maxLength={6}
							onChangeText={setOTP}
							validationError={errors.code}
							_focused={{ borderWidth: 0 }}
							style={{ letterSpacing: 14 }}
						/>
					)}
				</Box>

				{resending ? (
					<Box flexDirection="row" alignItems="center" justifyContent="flex-end" my="xl" px="lg">
						<Spinner />
					</Box>
				) : (
					<Box flexDirection="row" alignItems="center" justifyContent="flex-end" my="lg">
						<LinkButton onPress={async () => await resend()} disabled={countdown != 0 && !resending}>
							Resend OTP
						</LinkButton>
						{countdown > 0 ? <Text mx="base">({countdown}s)</Text> : null}
					</Box>
				)}
				<Box flexDirection="row" bg="yellow.100" alignItems="center" px="base" py="lg" borderRadius={10} borderWidth={1} borderColor="yellow.600">
					<Ionicons name="ios-information-circle-outline" size={24} color={colors.yellow[600]} />
					<Text maxWidth="89%" fontSize="sm" color="yellow.600" lineHeight="20px" ml="base">
						You told us you're human, now we need you to verify that by entering the one-time password we sent to the email you provided ({email.toLowerCase()})
					</Text>
				</Box>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<Box flex={1} />
				</TouchableWithoutFeedback>
			</Box>
		</SafeView>
	);
}
