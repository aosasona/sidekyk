import { AppException } from "../error";
import { HookActionArgs, HookActionHandlers } from "../types/speech";
import Voice from "@react-native-voice/voice";
import { IS_ANDROID } from "../constants";
import { canTranscribeWithDevice } from "./speech";

async function start({ setIsListening }: HookActionArgs) {
	try {
		const state = await Voice.start("en-US");
		if (state != null) {
			throw new AppException("Failed to start engine");
		}
		setIsListening(true);
	} catch (e) {
		console.log("startTranscribingWithDeviceEngine: ", e);
	}
}

async function stop({ setIsListening }: HookActionArgs) {
	try {
		const state = await Voice.stop();
		if (state != null) {
			throw new AppException("Failed to stop engine");
		}
		setIsListening(false);
	} catch (e) {
		console.log("stopTranscribingWithDeviceEngine: ", e);
	}
}

function handleEvents({ setIsListening, setError, setStream, reset }: HookActionArgs) {
	Voice.onSpeechStart = function (e) {
		reset();
		setIsListening(true);
		if (!!e?.error) {
			setError("Failed to start listening");
			console.log("Speech start error", e);
		}
	};

	Voice.onSpeechEnd = function (e) {
		setIsListening(false);
		if (!!e?.error) {
			setError("Failed to end listening");
			console.log("Speech end error", e);
		}
	};

	Voice.onSpeechResults = function (e) {
		reset();
		setStream(e?.value?.[0] ?? "");
		if (IS_ANDROID) setIsListening(false);
	};

	Voice.onSpeechError = function (e) {
		console.log("Speech error", e);
		setError(e?.error?.message || "");
		setIsListening(false);
	};
}

function unsubscribe() {
	Voice.removeAllListeners();
}

export default function deviceSpeechActions(args: HookActionArgs): HookActionHandlers {
	return {
		start: () => start(args),
		stop: () => stop(args),
		handleEvents: () => handleEvents(args),
		canTranscribe: canTranscribeWithDevice,
		unsubscribe,
	};
}
