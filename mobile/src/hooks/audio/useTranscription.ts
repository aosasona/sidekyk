import { useConfigStore } from "@sidekyk/stores";
import { useEffect, useMemo, useState } from "react";
import { makeActions } from "@sidekyk/lib/audio";
import { OnResultFunction, TranscriptionEngine } from "@sidekyk/lib/types/speech";
import { Audio } from "expo-av";

export default function useTranscription(onResult: OnResultFunction = null) {
  const config = useConfigStore();

  const [currentRecordingURI, setCurrentRecordingURI] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [canTranscribe, setCanTranscribe] = useState(false);
  const [stream, setStream] = useState("");
  const [error, setError] = useState("");

  // default to device transcription if no model is selected
  const engine: TranscriptionEngine = config.useDeviceTranscription ? "device" : config.selectedWhisperModel != null ? "asr" : "device";

  function reset() {
    setError("");
  }

  const actions = useMemo(
    () =>
      makeActions(engine, {
        processing,
        isListening,
        currentRecordingURI,
        recording,
        setStream,
        setIsListening,
        setCurrentRecordingURI,
        setProcessing,
        setError,
        setRecording,
        reset,
      }),
    [engine, canTranscribe, currentRecordingURI, isListening, recording, processing],
  );

  useEffect(() => {
    (async () => {
      setCanTranscribe(await actions.canTranscribe());
    })();
  }, [engine, canTranscribe]);

  useEffect(() => {
    if (canTranscribe) {
      actions.handleEvents();
    }
    return () => actions.unsubscribe();
  }, [canTranscribe, processing, currentRecordingURI]);

  useEffect(() => {
    // dump the final result to the onResult function and clean the stream
    if (stream && onResult != null && !isListening) {
      onResult({ result: stream, error, hasError: !!error });
      setStream("");
    }
  }, [stream, isListening]);

  async function start() {
    if (!canTranscribe) return;
    actions
      .start()
      .then()
      .catch((e) => console.error("startTranscribingWithDeviceEngine: ", e));
  }

  async function stop() {
    if (!canTranscribe) return;
    actions
      .stop()
      .then()
      .catch((e) => console.error("stopTranscribingWithDeviceEngine: ", e));
  }

  return {
    engine,
    start,
    stop,
    stream,
    error,
    processing,
    isListening,
    canTranscribe,
  } as const;
}
