import { Box, Cancel, SafeView, ScrollView, SettingsItem, SignOut, Text, UserOverview } from "@sidekyk/components";
import { AppException, showErrorAlert } from "@sidekyk/lib/error";
import { SettingsStackScreenProps } from "@sidekyk/lib/types/navigation";
import { useUserStore } from "@sidekyk/stores";
import { useLayoutEffect, useState } from "react";
import { Alert, RefreshControl } from "react-native";
import * as MailComposer from "expo-mail-composer";
import { checkForUpdateOnAppLoad } from "@sidekyk/lib/update";
import * as WebBrowser from "expo-web-browser";

export default function SettingsScreen({ navigation }: SettingsStackScreenProps<"Settings">) {
	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => <Cancel onPress={navigation.goBack} />,
		});
	}, []);

	const user = useUserStore();

	const [refreshing, setRefreshing] = useState(false);

	function refresh() {
		try {
			setRefreshing(true);
			user.loadUserDataFromAPI();
		} catch (e) {
			showErrorAlert("Failed to load data");
		} finally {
			setRefreshing(false);
		}
	}

	function openLinkInBrowser(url: string) {
		try {
			WebBrowser.openBrowserAsync(url).then().catch(showErrorAlert);
		} catch (e) {
			showErrorAlert(e);
		}
	}

	async function contactViaMail() {
		try {
			if (!(await MailComposer.isAvailableAsync())) {
				Alert.alert("Oops", "You don't seem to have a mail client installed on your device, but you can still contact us at developer@wyte.space :)");
				return;
			}
			await MailComposer.composeAsync({ recipients: ["developer@wyte.space"] });
		} catch (e) {
			showErrorAlert(e);
		}
	}

	return (
		<SafeView forceInset={{ top: "never", bottom: "never" }} isModal>
			<ScrollView flex={1} px="container" py="lg" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
				<UserOverview navigation={navigation} />

				<Box mt="xl" nobg>
					<Box bg="alt.100" borderRadius={10} py="xs">
						<SettingsItem icon={{ name: "card-outline", bg: "emerald.500" }} action={() => navigation.push("Usage")} title="Usage & subscription" single={false} />
						<SettingsItem icon={{ name: "color-palette", bg: "primary" }} title="Appearance" action={() => navigation.push("Appearance")} single={false} />
						<SettingsItem icon={{ name: "chatbox", bg: "blue.500" }} title="Chat settings" action={() => navigation.push("Chat settings")} single={false} />
						<SettingsItem
							icon={{ name: "mic", bg: "rose.500" }}
							title="Speech recognition"
							action={() => navigation.push("Speech Recognition")}
							single={false}
							showBorder={false}
							showBg={false}
						/>
					</Box>
				</Box>

				<Box mt="xl" nobg>
					<Box bg="alt.100" borderRadius={10} py="xs">
						<SettingsItem title="Contact us" icon={{ name: "mail-open-outline", bg: "blue.500" }} action={() => contactViaMail().then().catch(showErrorAlert)} single={false} />
						<SettingsItem
							icon={{ name: "ios-lock-closed", bg: "gray.600" }}
							action={() => openLinkInBrowser("https://sidekyk.app/privacy-policy")}
							title="Privacy policy"
							single={false}
						/>
						<SettingsItem
							icon={{ name: "book-outline", bg: "rose.500" }}
							title="Terms and conditions"
							action={() => openLinkInBrowser("https://sidekyk.app/terms")}
							single={false}
							showBorder={false}
						/>
					</Box>
				</Box>

				<Box mt="xl" transparent>
					<Box bg="alt.100" borderRadius={10} py="xs">
						<SettingsItem icon={{ name: "ios-bug", bg: "yellow.500" }} title="Report a bug" action={() => navigation.push("Feedback", { type: "bug_report" })} single={false} />
						<SettingsItem
							icon={{ name: "ios-reload", bg: "green.500" }}
							title="Check for updates"
							action={async () => await checkForUpdateOnAppLoad(true)}
							single={false}
							showBorder={false}
						/>
					</Box>
				</Box>

				<SignOut />

				<Box mt="xl" mb="3xl" transparent>
					<Text color="alt.400" fontSize="sm" mt="base" textAlign="center">
						&copy;{new Date().getFullYear()} Sidekyk
					</Text>
				</Box>
			</ScrollView>
		</SafeView>
	);
}
