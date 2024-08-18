import { Box, Button, Divider, Input, Label, SafeView, ScrollView, SettingsItem } from "@sidekyk/components";
import { useMemo, useState } from "react";
import { handleUnwrappedError, showErrorAlert, unwrapHTTPError } from "@sidekyk/lib/error";
import { updateUser } from "@sidekyk/lib/requests/user";
import { UpdateUserRequest } from "@sidekyk/lib/types/generated";
import { SettingsStackScreenProps } from "@sidekyk/lib/types/navigation";
import { useUserStore } from "@sidekyk/stores";
import LoadingOverlay from "@sidekyk/components/LoadingOverlay";
import { exportUserData } from "@sidekyk/lib/filesystem/user-data";
import { IS_ANDROID } from "@sidekyk/lib/constants";
import { Alert } from "react-native";

export default function ProfileScreen({ navigation }: SettingsStackScreenProps<"Profile">) {
	const userStore = useUserStore();

	const [isSaving, setIsSaving] = useState(false);
	const [isExporting, setIsExporting] = useState(false);
	const [name, setName] = useState({
		firstName: userStore?.first_name || "",
		lastName: userStore?.last_name || "",
	});
	const [errors, setErrors] = useState<Partial<UpdateUserRequest> | null>(null);

	function handleNameChange(field: keyof typeof name, value: string) {
		setName((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: "" }));
	}

	async function saveChanges() {
		try {
			setIsSaving(true);
			const res = await updateUser({ first_name: name.firstName, last_name: name.lastName });
			handleUnwrappedError(unwrapHTTPError<UpdateUserRequest, UpdateUserRequest>(res), setErrors);
			setName({ firstName: res?.data?.first_name || userStore.first_name, lastName: res?.data?.last_name || userStore.last_name });
			return userStore.setName({ firstName: res?.data?.first_name || userStore.first_name, lastName: res?.data?.last_name || userStore.last_name });
		} catch (e) {
			return showErrorAlert(e);
		} finally {
			setIsSaving(false);
		}
	}

	function _exportData() {
		try {
			setIsExporting(true);
			exportUserData({ firstName: userStore.first_name, lastName: userStore.last_name })
				.then()
				.catch(showErrorAlert)
				.finally(() => setIsExporting(false));
		} catch (e) {
		} finally {
			if (IS_ANDROID) {
				setIsExporting(false);
			}
		}
	}

	function handleExportData() {
		Alert.alert("Export data", "You can only export your data once a couple of days. Are you sure you want to continue now?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Continue",
				onPress: _exportData,
			},
		]);
	}

	const isNameChanged = useMemo(() => name.firstName !== userStore.first_name || name.lastName !== userStore.last_name, [name]);

	return (
		<SafeView forceInset={{ top: "never", bottom: "never" }} isModal>
			<ScrollView flex={1} px="container" pt="lg">
				<Box>
					<Label>Personal details</Label>

					<Box bg="alt.100" borderRadius={14}>
						<Input value={name.firstName} onChangeText={(e) => handleNameChange("firstName", e)} validationError={errors?.first_name} placeholder="First name" isFormGroup />
						<Divider />
						<Input value={name.lastName} onChangeText={(e) => handleNameChange("lastName", e)} validationError={errors?.last_name} placeholder="Last name" isFormGroup />
						<Divider />
						<Input value={userStore.email} placeholder="E-mail address" editable={false} isFormGroup />
					</Box>

					<Button mt="xl" isLoading={isSaving} onPress={async () => await saveChanges()} disabled={!isNameChanged}>
						Save
					</Button>
				</Box>

				<Box mt="xl">
					<Label>Manage account</Label>
					<Box bg="alt.100" borderRadius={10} py="xs">
						<SettingsItem
							title="Change password"
							action={() => navigation.push("Change Password", { email: userStore.email })}
							icon={{ name: "ios-key", bg: "yellow.500" }}
							single={false}
						/>
						<SettingsItem title="Export data" icon={{ name: "ios-archive-sharp", bg: "emerald.500" }} action={handleExportData} single={false} />
						<SettingsItem
							title="Delete account"
							action={() => navigation.push("Delete Account")}
							icon={{ name: "ios-trash-bin", bg: "red.500" }}
							single={false}
							showBorder={false}
						/>
					</Box>
				</Box>
			</ScrollView>
			<LoadingOverlay visible={isExporting} text="Exporting data" />
		</SafeView>
	);
}
