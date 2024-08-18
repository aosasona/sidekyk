import { Box, SafeView, ScrollView, Text, SettingsItem, Spinner, ModelCard } from "@sidekyk/components";
import { showErrorAlert } from "@sidekyk/lib/error";
import { getWhisperModels } from "@sidekyk/lib/requests/models";
import useConfigStore from "@sidekyk/stores/config";
import { useCallback, useEffect, useState } from "react";
import { WhisperModels as WhisperModel } from "@sidekyk/lib/types/generated";
import useSWRImmutable from "swr/immutable";
import { FlashList } from "@shopify/flash-list";
import { SettingsStackScreenProps } from "@sidekyk/lib/types/navigation";
import { makeModelsFolder } from "@sidekyk/lib/filesystem/model";
import { OVERRIDE_ENABLE_LOCAL_WHISPER } from "@sidekyk/lib/constants";

export default function SpeechRecognitionScreen({ navigation }: SettingsStackScreenProps<"Speech Recognition">) {
	const config = useConfigStore();
	const { data, error, isLoading, mutate } = useSWRImmutable("models", getWhisperModels);
	const [retryCount, setRetryCount] = useState(0);

	useEffect(() => {
		(async () => await makeModelsFolder())();
	}, []);

	useEffect(() => {
		if (error) {
			showErrorAlert(error);
		}
	}, [error]);

	useEffect(() => {
		if ((!data || data?.length == 0) && retryCount < 4 && !isLoading) {
			mutate();
			setRetryCount((prev) => prev + 1);
		}
	}, [data, retryCount]);

	function renderItem({ item, index }: { item: WhisperModel; index: number }) {
		return <ModelCard model={item} idx={index} total={data?.length ?? 0} config={config} />;
	}

	const memoizedRenderItem = useCallback(renderItem, [data?.length, isLoading]);

	return (
		<SafeView forceInset={{ top: "never", bottom: "never" }} isModal>
			<ScrollView flex={1} px="container" pt="lg">
				<SettingsItem
					title="Use device's transcription"
					type="toggle"
					value={config.useDeviceTranscription}
					action={(e: boolean) => config.changeTranscriptionMethod(e)}
					showIcon={false}
				/>
				<Box px="lg" mt="base" mb="xl" nobg>
					<Text color="alt.400" fontSize="sm" fontWeight={500} lineHeight="20px">
						Use on-device transcription engine (Speech-To-Text). If this option is greyed out, your device has no Speech-To-Text engine installed or supported.
					</Text>
				</Box>

				<SettingsItem title="Send message immediately" type="toggle" value={config.sendMessageImmediately} action={config.toggleSendMessageImmediately} showIcon={false} />
				<Box px="lg" mt="base" mb="xl" nobg>
					<Text color="alt.400" fontSize="sm" fontWeight={500} lineHeight="20px">
						By default, after recording a voice message and transcription is complete, you will be asked to confirm the message before sending. If this option is enabled, the
						message will be sent immediately after transcription is complete.
					</Text>
				</Box>

				<SettingsItem title="Test speech recognition" type="pressable" action={() => navigation.navigate("Test Speech Recognition")} showIcon={false} single />

				{OVERRIDE_ENABLE_LOCAL_WHISPER && config.allowExperimentalWhisper ? (
					<Box mt="xl" mb="3xl" nobg>
						<Box flexDirection="row" alignItems="center" justifyContent="space-between" mb="base" nobg>
							<Text color="alt.400" fontSize="sm" px="base">
								AVAILABLE MODELS
							</Text>
							<Spinner isLoading={isLoading} />
						</Box>

						{data && data?.length > 0 && !isLoading ? (
							<Box minHeight={200} bg="alt.100" width="100%" borderRadius={8} py="sm">
								<FlashList data={data} keyExtractor={(item) => `${item.alias}-${item.average_size}`} renderItem={memoizedRenderItem} estimatedItemSize={200} />
							</Box>
						) : null}

						<Box px="lg" mt="base" nobg>
							<Text color="alt.400" fontSize="sm" fontWeight={500} lineHeight="20px">
								Please note that the models are large files and may take a while to download, do not close the app or leave this page while downloading.
							</Text>
						</Box>
					</Box>
				) : null}
			</ScrollView>
		</SafeView>
	);
}
