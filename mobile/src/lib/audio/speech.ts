import Voice from "@react-native-voice/voice";
import { useConfigStore } from "@sidekyk/stores";
import { modelExists } from "../filesystem/model";

export async function canTranscribeWithCustomModel(): Promise<boolean> {
  try {
    const customModel = useConfigStore.getState().selectedWhisperModel;
    if (!customModel) return false;
    const exists = await modelExists(customModel);
    return exists ?? false;
  } catch (e) {
    return false;
  }
}

export async function canTranscribeWithDevice(): Promise<boolean> {
  try {
    const allowed = await Voice.isAvailable();
    return !!allowed;
  } catch (e) {
    return false;
  }
}
