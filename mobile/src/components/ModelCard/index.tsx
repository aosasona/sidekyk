import { Fragment, useEffect, useMemo, useState } from "react";
import Box from "../Box";
import LinkButton from "../Button/LinkButton";
import Text from "../Text/Text";
import ProgressBar from "../ProgressBar";
import { AppException, showErrorAlert } from "@sidekyk/lib/error";
import useConfigStore, { ConfigStore } from "@sidekyk/stores/config";
import { capitaliseFirst } from "@sidekyk/lib/string";
import { IS_IOS } from "@sidekyk/lib/constants";
import { deleteModel, getDownloadedModels, makeModelLocalUri } from "@sidekyk/lib/filesystem/model";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { PRIMARY_COLOR } from "@sidekyk/theme";
import { WhisperModel, WhisperModelAlias } from "@sidekyk/lib/types/model";
import { convertSize, getFreedeviceStorage } from "@sidekyk/lib/filesystem/helpers";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

type ModelCardProps = {
	model: WhisperModel;
	idx: number;
	total: number;
	config: ConfigStore;
};

export default function ModelCard({ model, idx, total }: ModelCardProps) {
	const config = useConfigStore();
	const [download, setDownload] = useState({ total: 0, current: 0, isDownloading: false });
	const [cancelCount, setCancelCount] = useState(0);
	const [removeCount, setRemoveCount] = useState(0);
	const [downloadedModels, setDownloadedModels] = useState<string[]>([]);

	useEffect(() => {
		(async () => {
			const models = await getDownloadedModels();
			setDownloadedModels(models);
		})();
	}, [config.selectedWhisperModel, removeCount]);

	const downloadTask = useMemo(
		() =>
			FileSystem.createDownloadResumable(
				model.url,
				makeModelLocalUri(model.alias as WhisperModelAlias),
				{ sessionType: FileSystem.FileSystemSessionType.BACKGROUND },
				(data) => {
					if (data.totalBytesExpectedToWrite == 0) return;
					if (!download.total) setDownload((prev) => ({ ...prev, total: data.totalBytesExpectedToWrite }));
					if (!download.isDownloading) setDownload((prev) => ({ ...prev, isDownloading: true }));
					if (data.totalBytesWritten == data.totalBytesExpectedToWrite) {
						setDownload({ total: 0, current: 0, isDownloading: false });
						return config.changeTranscriptionMethod(model.alias as WhisperModelAlias);
					}
					setDownload((prev) => ({ ...prev, current: data.totalBytesWritten }));
				},
			),
		[cancelCount],
	);

	const size = useMemo(() => {
		return convertSize<number>({ from: "MB", to: "GB", size: model.average_size, decimalPlaces: 2, stringify: false });
	}, [model.average_size]);

	const name = useMemo(() => capitaliseFirst(model.alias), [model.alias]);
	const isDownloaded = useMemo(
		() => downloadedModels.includes(`${model.alias}.en`),
		[downloadedModels, model.alias, config.useDeviceTranscription, config.selectedWhisperModel],
	);
	const isSelected = useMemo(() => config.selectedWhisperModel === model.alias, [config.selectedWhisperModel, model.alias]);

	async function handleModelSelection() {
		try {
			if (download.isDownloading) return;
			if (isDownloaded) return config.changeTranscriptionMethod(model.alias as WhisperModelAlias);
			const freeStorage = await getFreedeviceStorage();
			if (!freeStorage) throw new AppException("No free storage available");
			if (freeStorage < size) throw new AppException("Not enough free storage available");
			return await downloadTask.downloadAsync();
		} catch (e) {
			return showErrorAlert(e);
		} finally {
			return setDownload({ total: 0, current: 0, isDownloading: false });
		}
	}

	async function cancelDownload() {
		try {
			await downloadTask.cancelAsync();
			setDownload({ total: 0, current: 0, isDownloading: false });
			return setCancelCount((prev) => prev + 1);
		} catch (e) {
			showErrorAlert(e);
		}
	}

	function removeDownload() {
		Alert.alert("Remove model", `Are you sure you want to remove the ${name} model?`, [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Remove",
				style: "destructive",
				onPress: async () => {
					await deleteModel(model.alias as WhisperModelAlias);
					setRemoveCount((prev) => prev + 1);
					return config.changeTranscriptionMethod(true);
				},
			},
		]);
	}

	function getColor(): { bg: string; color: string } {
		if (model.required_ram <= 2) return { bg: "#05966933", color: "#059669" };
		if (model.required_ram <= 4) return { bg: "#F59E0B33", color: "#F59E0B" };
		return { bg: "#EF444433", color: "#EF4444" };
	}

	const { bg, color } = useMemo(getColor, [model.required_ram]);

	function handler() {
		if (download.isDownloading) return cancelDownload();
		return handleModelSelection();
	}

	return (
		<Fragment>
			<Box px="lg" py="base" nobg>
				<Box flexDirection="row" justifyContent="space-between" px="xs" nobg>
					<Box nobg>
						<Text fontSize="lg" fontWeight={IS_IOS ? 600 : 700}>
							{name}
						</Text>
						<Text color="alt.400" fontWeight={IS_IOS ? 600 : 700} fontSize={14} mt="sm">
							{size}GB
						</Text>
					</Box>

					<Box flexDirection="row" alignItems="center" nobg>
						{isDownloaded ? (
							<LinkButton color="red.500" onPress={removeDownload}>
								Remove
							</LinkButton>
						) : null}
						<TouchableOpacity style={{ paddingHorizontal: 6, paddingVertical: 2, marginLeft: 4 }} onPress={handler}>
							{isSelected ? (
								<Ionicons name="ios-checkmark-circle" size={26} color={PRIMARY_COLOR} />
							) : download.isDownloading ? (
								<Ionicons name="ios-stop-circle-outline" size={26} color={PRIMARY_COLOR} />
							) : isDownloaded ? (
								<Ionicons name="ios-checkmark-circle-outline" size={26} color={PRIMARY_COLOR} />
							) : (
								<Ionicons name="ios-download-outline" size={26} color={PRIMARY_COLOR} />
							)}
						</TouchableOpacity>
					</Box>
				</Box>

				{download.isDownloading ? <ProgressBar progress={download.current} total={download.total} height={5} bg="alt.200" color="primary" mt="base" /> : null}

				<Box mt="base" nobg>
					<Text color="alt.800" fontWeight={400} lineHeight="22px">
						{model.description}
					</Text>
				</Box>

				<Box bg={bg as any} alignSelf="flex-start" px="base" py="sm" borderRadius={4} mt="lg">
					<Text color={color as any} fontSize={11} fontWeight={600}>
						Minimum RAM: {model.required_ram}GB
					</Text>
				</Box>
			</Box>
			{idx != total - 1 ? <Box bg="alt.200" height={0.8} my="base" ml="lg" opacity={0.7} /> : null}
		</Fragment>
	);
}
