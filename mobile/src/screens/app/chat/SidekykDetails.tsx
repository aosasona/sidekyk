import { Box, Cancel, CustomPressable, Label, ProfileImage, SafeView, ScrollView, SettingsItem, Text } from "@sidekyk/components";
import { showErrorAlert } from "@sidekyk/lib/error";
import { deleteSidekyk } from "@sidekyk/lib/requests/sidekyk";
import { capitaliseFirst } from "@sidekyk/lib/string";
import { AppStackScreenProps } from "@sidekyk/lib/types/navigation";
import { AnimatePresence, MotiView } from "moti";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { toast } from "burnt";
import { changeConversationSettings, getConversationSettings } from "@sidekyk/lib/requests/conversations";
import { ConversationSettings } from "@sidekyk/lib/types/generated";

export default function ConversationDetailsScreen({ route, navigation }: AppStackScreenProps<"Details">) {
	if (!route.params) {
		navigation.goBack();
		return null;
	}

	const [isLoadingSettings, setIsLoadingSettings] = useState(false);
	const [settings, setSettings] = useState<ConversationSettings>({
		is_public: false,
		allow_training: false,
	});

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => <Cancel onPress={navigation.goBack} />,
			headerLeft: () => <EditButton navigation={navigation} route={route} />,
		});
	}, []);

	useEffect(() => {
		loadSettings();
	}, [route.params?.conversationID]);

	const data = useMemo(() => route.params.data, [route.params]);
	const personalityTitle = useMemo(
		() =>
			data?.personality_name
				?.split(" ")
				?.map((l) => capitaliseFirst(l))
				?.join(" ") ??
			data?.personality_name ??
			"Unknown",
		[data]
	);

	function loadSettings() {
		if (!route.params.conversationID) return;
		setIsLoadingSettings(true);
		getConversationSettings(route.params.conversationID)
			.then((s) => {
				if (s) setSettings(s);
			})
			.catch(showErrorAlert)
			.finally(() => setIsLoadingSettings(false));
	}

	function handleConversationSettings({ is_public, allow_training }: Partial<ConversationSettings>) {
		if (!route.params.conversationID) return;
		if (isLoadingSettings) return;
		if (settings.is_public === is_public && settings.allow_training === allow_training) return;

		if (is_public != null && is_public != undefined) setSettings({ ...settings, is_public: is_public });
		if (allow_training != null && allow_training != undefined) setSettings({ ...settings, allow_training: allow_training });
		changeConversationSettings(route.params.conversationID, { is_public, allow_training }).then().catch(showErrorAlert);
	}

	function handleDeleteSidekyk() {
		Alert.alert("Confirm", `Are you sure you want to permanently delete this sidekyk? This action CANNOT be undone.`, [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Delete",
				style: "destructive",
				onPress: () => {
					deleteSidekyk(data?.sidekyk_id, () => navigation.replace("Home"))
						.then()
						.catch(showErrorAlert);
				},
			},
		]);
	}

	function copyPersonality() {
		Clipboard.setStringAsync(data?.instruction ?? "")
			.then(() => toast({ title: "Copied to clipboard", preset: "none" }))
			.catch(showErrorAlert);
	}

	return (
		<SafeView forceInset={{ top: "never" }} avoidKeyboard isModal>
			<ScrollView flex={1} showsVerticalScrollIndicator={false}>
				<Box alignItems="center" mt="xl">
					<MotiView from={{ transform: [{ rotate: "0deg" }] }} animate={{ transform: [{ rotate: "180deg" }, { rotate: "-180deg" }] }}>
						<ProfileImage size={80} padding={34} bg={data.color as any} uri={data.avatar_url} />
					</MotiView>
					<Text fontSize="xl" fontWeight="bold" mt="md">
						{data.name}
					</Text>
					<Box bg="alt.100" px="md" py={6} borderRadius={12} mt="lg">
						<Text fontSize="sm" color="alt.500">
							{personalityTitle}
						</Text>
					</Box>
				</Box>

				<Box px="container" mt="xl">
					<Label>Sidekick Settings</Label>
					<Box bg="alt.100" borderRadius={12}>
						<SettingsItem
							icon={{ name: "ios-chatbubble-sharp", bg: "blue.500" }}
							title="Start a new conversation"
							action={() => navigation.push("Conversation", { sidekyk: data })}
							single={false}
						/>
						<SettingsItem icon={{ name: "ios-trash", bg: "red.500" }} title="Delete sidekick" action={handleDeleteSidekyk} />
					</Box>
				</Box>

				{data.personality_id == 0 ? (
					<Box px="container" mt="xl">
						<Box>
							<Label opacity={0.8}>Personality</Label>
							<Box bg="alt.100" px={14} py="md" borderRadius={8} mt="sm">
								<Text color="alt.600" fontWeight={400} lineHeight="25px">
									{data.instruction}
								</Text>
							</Box>
						</Box>
						<Box alignItems="flex-end" mt="md">
							<CustomPressable onPress={copyPersonality} enableHaptics>
								<Box bg="primaryFaded" borderWidth={1} borderColor="primary" borderRadius={20} px="lg" py="base">
									<Text color="primary" fontSize="sm">
										Copy
									</Text>
								</Box>
							</CustomPressable>
						</Box>
					</Box>
				) : null}

				<AnimatePresence>
					{!isLoadingSettings && settings && !!route.params.conversationID ? (
						<MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
							<Box px="container" mt="xl" nobg>
								<Label>Conversation Settings</Label>
								<Box bg="alt.100" borderRadius={10} py="xs">
									<SettingsItem
										icon={{ name: "ios-link", bg: "blue.500" }}
										title="Enable sharing (make conversation public)"
										type="toggle"
										value={settings?.is_public ?? false}
										action={() => handleConversationSettings({ is_public: !settings?.is_public })}
										single={false}
									/>
									<SettingsItem
										icon={{ name: "ios-book", bg: "orange.500" }}
										title="Use as training data"
										type="toggle"
										value={settings?.allow_training ?? false}
										action={() => handleConversationSettings({ allow_training: !settings?.allow_training })}
										single={false}
										showBorder={false}
									/>
								</Box>
							</Box>
						</MotiView>
					) : null}
				</AnimatePresence>

				<Box height={150} />
			</ScrollView>
		</SafeView>
	);
}

function EditButton({ navigation, route }: AppStackScreenProps<"Details">) {
	function handlePress() {
		navigation.replace("Create Sidekyk", { sidekyk: route.params.data });
	}

	return (
		<CustomPressable onPress={() => handlePress()}>
			<Box px="sm" nobg>
				<Text fontSize={20} fontWeight={400} color="primary">
					Edit
				</Text>
			</Box>
		</CustomPressable>
	);
}
