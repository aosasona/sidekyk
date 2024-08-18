import { Box, Text, SafeView, ScrollView, SettingsItem } from "@sidekyk/components";
import { useConfigStore } from "@sidekyk/stores";

export default function ExperimentalScreen() {
	const config = useConfigStore();

	return (
		<SafeView forceInset={{ top: "never", bottom: "never" }} isModal>
			<ScrollView flex={1} px="container" pt="lg">
				<SettingsItem title="Enable whisper" type="toggle" value={config.allowExperimentalWhisper} action={config.toggleAllowExperimentalWhisper} showIcon={false} />
				<Box px="lg" mt="base" mb="xl" nobg>
					<Text color="alt.400" fontSize="sm" fontWeight={500} lineHeight="20px">
						This will allow you use local Whisper AI models for transcription. This is highly unstable and may cause the app to crash, cause your device to overheat or
						may not work as expected. Several larger models have also been disabled for download via the API to protect your device and you will be enabling this feature
						at your own risk!
					</Text>
				</Box>
			</ScrollView>
		</SafeView>
	);
}
