import { HookActionArgs, HookActionHandlers } from "../types/speech";
import { canTranscribeWithCustomModel } from "./speech";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useWhisperStore } from "@sidekyk/stores";

async function start({ isListening, processing, setProcessing, setRecording, setIsListening }: HookActionArgs) {
	try {
		if (isListening || processing) return;
		setIsListening(true);
		await Audio.requestPermissionsAsync();
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: true,
			playsInSilentModeIOS: true,
		});
		const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
		if (!recording) throw new Error("recording is empty");
		setRecording(recording);
		setProcessing(true);
	} catch (e) {
		console.error("start whisper model: ", e);
	}
}

async function stop({ recording, setRecording, setProcessing, setCurrentRecordingURI, setIsListening }: HookActionArgs) {
	try {
		setRecording(null);

		await recording?.stopAndUnloadAsync();
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
		});

		const uri = recording?.getURI();
		if (!uri) return;

		setCurrentRecordingURI(uri);
	} catch (e) {
		console.error("stop whisper model: ", e);
	} finally {
		setIsListening(false);
		setProcessing(false);
	}
}

function handleEvents({ currentRecordingURI, setProcessing, setStream, setCurrentRecordingURI }: HookActionArgs) {
	try {
		if (!currentRecordingURI) {
			return;
		}

		const exists = FileSystem.getInfoAsync(currentRecordingURI)
			.then(({ exists }) => exists)
			.catch(console.error);
		if (!exists) throw new Error("recording does not exist");

		const ctx = useWhisperStore.getState().ctx;
		if (!ctx) throw new Error("ctx is empty");

		let path = currentRecordingURI.replace("file://", "");
		if (!path) throw new Error("path is empty");

		const { promise } = ctx.transcribe(path, {
			language: "en",
			maxLen: 1,
			tokenTimestamps: true,
		});

		promise
			.then((res) => {
				setStream(res.result);
			})
			.catch((e) => {
				console.error("transcribe error: ", e);
			})
			.finally(() => {
				// clean up
				FileSystem.deleteAsync(currentRecordingURI)
					.then()
					.catch((e) => console.error("delete recording error: ", e));
			});
	} catch (e) {
		console.error("handle events: ", e);
	} finally {
		setCurrentRecordingURI("");
		setProcessing(false);
	}
}

export default function whisperSpeechActions(args: HookActionArgs): HookActionHandlers {
	return {
		start: () => start(args),
		stop: () => stop(args),
		canTranscribe: canTranscribeWithCustomModel,
		handleEvents: () => handleEvents(args),
		unsubscribe: () => {},
	};
}
