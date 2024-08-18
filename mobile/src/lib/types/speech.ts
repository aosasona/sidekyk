import { Audio } from "expo-av";

type TranscribeRealtimeEvent = {};

export type WhisperContext = {};

export interface HookActionHandlers {
	start(): Promise<void>;
	stop(): Promise<void>;
	canTranscribe(): Promise<boolean>;
	handleEvents: () => void;
	unsubscribe: () => void;
}

export type HookActionArgs = {
	recording: Audio.Recording | null;
	isListening: boolean;
	processing: boolean;
	currentRecordingURI: string;
	setStream: (stream: string) => void;
	setError: (error: string) => void;
	setIsListening: (isListening: boolean) => void;
	setRecording: (recording: Audio.Recording | null) => void;
	setProcessing: (processing: boolean) => void;
	setCurrentRecordingURI: (uri: string) => void;
	reset: () => void;
};

export type WhisperSession = {
	stop: () => void;
	subscribe: (callback: (event: TranscribeRealtimeEvent) => void) => void;
};

export type TranscriptionEngine = "device" | "asr";
export type TranscriptionResult = { result: string; error: string | null; hasError: boolean };
export type OnResultFunction = ((e: TranscriptionResult) => void) | null;
