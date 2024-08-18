import { create } from "zustand";
import randomColor from "randomcolor";
import useConfigStore from "./config";
import { getUser } from "@sidekyk/lib/requests/user";
import { GetUserResponse as User } from "@sidekyk/lib/types/generated";

type UserTier = User["subscription_type"];

type UserStore = User & {
	profileBackdrop: string;
	hasLoadedUser: boolean;
	setName: (data: { firstName?: string; lastName?: string }) => void;
	is: (tier: UserTier) => boolean;
	loadUserDataFromAPI: () => void;
	generateProfileBackdrop: () => string;
	reset: () => void;
};

const useUserStore = create<UserStore>((set, get) => ({
	id: 0,
	first_name: "",
	last_name: "",
	email: "",
	subscription_type: "FREE",
	created_at: "",
	updated_at: "",
	is_trial: false,
	profileBackdrop: "",
	hasLoadedUser: false,
	is: (tier) => get().subscription_type === tier,
	setName: ({ firstName, lastName }) => {
		set({ first_name: firstName || get().first_name, last_name: lastName || get().last_name });
	},
	loadUserDataFromAPI: () => {
		set({ hasLoadedUser: false });
		getUser().then((d) =>
			set({
				...d,
				hasLoadedUser: true,
			}),
		);
	},
	generateProfileBackdrop: generateColor,
	reset: () => {
		set({
			id: 0,
			first_name: "",
			last_name: "",
			email: "",
			subscription_type: "FREE",
			created_at: "",
			updated_at: "",
			is_trial: false,
			profileBackdrop: "",
			hasLoadedUser: false,
		});
	},
}));

function generateColor(): string {
	return randomColor({
		luminosity: useConfigStore.getState().theme,
		format: "hex",
	});
}

export default useUserStore;
