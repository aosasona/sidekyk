import { Ionicons } from "@expo/vector-icons";
import { Box, Text, Input, Label, LinkButton, SafeView, ScrollView, Dropdown } from "@sidekyk/components";
import useTheme from "@sidekyk/hooks/useTheme";
import { GPT_Models } from "@sidekyk/lib/constants";
import { mask } from "@sidekyk/lib/string";
import { SettingsStackScreenProps } from "@sidekyk/lib/types/navigation";
import { useUserStore, useOpenAIConfigStore } from "@sidekyk/stores";
import useConfigStore from "@sidekyk/stores/config";
import { toast } from "burnt";
import { useMemo, useState } from "react";

type GPTModelKey = keyof typeof GPT_Models;

export default function ChatSettingsScreen(_: SettingsStackScreenProps<"Chat settings">) {
	const {
		theme: { colors },
	} = useTheme();
	const oaiStore = useOpenAIConfigStore();
	const config = useConfigStore();
	const user = useUserStore();

	const [key, setKey] = useState(oaiStore.apiKey);

	function handleSaveKey() {
		if (!key) return;
		oaiStore.setApiKey(key?.trim());
		toast({
			title: "Saved",
			message: "Key saved on device",
			preset: "done",
		});
	}

	function handleRemoveKey() {
		oaiStore.removeApiKey();
		setKey("");

		toast({
			title: "Removed",
			message: "Key removed from device",
			preset: "done",
		});
	}

	const isEditable = useMemo(() => (oaiStore.apiKey as string)?.length == 0, [oaiStore.apiKey]);
	const selectedModel = useMemo(() => oaiStore?.globalModel || "", [oaiStore.globalModel]);
	const availableGPTModels = useMemo(
		() => Object.keys(GPT_Models).filter((key) => GPT_Models[key as GPTModelKey]?.included_plans?.includes(user.subscription_type)),
		[user.subscription_type]
	);

	return (
		<SafeView forceInset={{ top: "never" }} isModal>
			<ScrollView flex={1} px="container" pt="lg">
				<Box mb="lg">
					<Label>Model</Label>

					<Dropdown
						items={availableGPTModels}
						selectedItem={selectedModel}
						renderListItem={({ item }) => GPT_Models?.[item as GPTModelKey]?.alias}
						renderSelectedItem={(_) => GPT_Models[oaiStore.globalModel || ""].alias}
						onSelect={(item) => oaiStore.setGlobalModel(item as any)}
						disabled={availableGPTModels?.length == 0}
					/>
				</Box>

				<Box>
					<Label>OpenAI API Key</Label>
					<Box flexDirection="row" alignItems="center" justifyContent="space-between">
						<Box flexGrow={1} maxWidth="80%">
							<Input
								placeholder="sk-xxxxxxxxxxxxxxx"
								value={isEditable ? key : mask(key, key?.length / 1.25, false)}
								onChangeText={setKey}
								numberOfLines={1}
								editable={isEditable}
							/>
						</Box>
						<Box width={10} />
						{!isEditable ? (
							<Box px="lg">
								<LinkButton onPress={handleRemoveKey}>
									<Ionicons name="close-sharp" size={26} color={colors.primary} />
								</LinkButton>
							</Box>
						) : (
							<Box px="md">
								<LinkButton onPress={handleSaveKey} disabled={key?.length == 0}>
									Save
								</LinkButton>
							</Box>
						)}
					</Box>
					<Box pl="md">
						<Text color="alt.400" fontSize="sm" fontWeight={500} lineHeight="20px" mt="base">
							Your OpenAI key is saved locally on your device & used to make requests on your behalf to the OpenAI API. Your key would still be used even if you are on a paid plan
							as long as you set it.
						</Text>
					</Box>
				</Box>
			</ScrollView>
		</SafeView>
	);
}
