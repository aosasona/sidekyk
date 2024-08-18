import * as speech from "./speech";
import * as deviceActions from "./device.action";
import * as whisperActions from "./whisper.action";
import { HookActionArgs, HookActionHandlers, TranscriptionEngine } from "../types/speech";

function makeActions(engine: TranscriptionEngine, args: HookActionArgs): HookActionHandlers {
	if (engine == "device") {
		return deviceActions.default(args);
	} else if (engine == "asr") {
		return whisperActions.default(args);
	} else {
		throw new Error("Unknown engine");
	}
}

export { speech, makeActions };
