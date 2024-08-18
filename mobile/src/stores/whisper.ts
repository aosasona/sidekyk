import { WhisperModelAlias } from "@sidekyk/lib/types/model";
import { WhisperContext } from "@sidekyk/lib/types/speech";
import { create } from "zustand";

type WhisperStore = {
	ctx: WhisperContext | null;
	isInitializing: boolean;
	init: (selectedModel: WhisperModelAlias | null) => Promise<void>;
	purge: () => void;
};

const whisperStore = create<WhisperStore>((set, get) => ({
	ctx: null,
	isInitializing: false,
	init: async (_) => {},
	purge: () => null,
}));

export default whisperStore;
