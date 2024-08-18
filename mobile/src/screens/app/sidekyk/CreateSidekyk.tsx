import { useEffect, useLayoutEffect, useState } from "react";
import { Box, Button, SafeView, ScrollView, Text, Spinner, ProfileImage, Cancel, ColorPicker } from "@sidekyk/components";
import { Avatar, CreateSidekykBody, CreateSidekykResponse } from "@sidekyk/lib/types/generated";
import CustomPressable from "@sidekyk/components/CustomPressable";
import { getAvatars } from "@sidekyk/lib/requests/sidekyk";
import useSWRImmutable from "swr/immutable";
import useTheme from "@sidekyk/hooks/useTheme";
import { AppearanceSegment, DetailsSegment } from "@sidekyk/components/CreateSidekyk";
import { default as OriginalSegmentedControl, SegmentedControlProps } from "@react-native-segmented-control/segmented-control";
import { AppException, showErrorAlert, unwrapHTTPError } from "@sidekyk/lib/error";
import { CustomApiResponse, ValidationErrors } from "@sidekyk/lib/types/requests";
import { api } from "@sidekyk/lib/requests/defaults";
import { AppStackScreenProps } from "@sidekyk/lib/types/navigation";
import { returnedResults } from "reanimated-color-picker";
import randomColor from "randomcolor";

const SegmentedControl = OriginalSegmentedControl as unknown as React.FC<SegmentedControlProps>;

enum Segments {
	DETAILS,
	APPEARANCE,
	ADVANCED,
}
// TODO: handle editing stuff
export default function CreateSidekykScreen({ navigation, route }: AppStackScreenProps<"Create Sidekyk">) {
	const prevSidekyk = route.params?.sidekyk;

	useLayoutEffect(() => {
		navigation.setOptions({
			title: prevSidekyk ? "Edit Sidekyk" : "Create Sidekyk",
			headerRight: () => <Cancel onPress={navigation.goBack} />,
		});
	}, []);

	const { colorScheme } = useTheme();
	const { data: avatars, isLoading: isLoadingAvatars } = useSWRImmutable("avatars", getAvatars);

	const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
	const [creating, setCreating] = useState(false);
	const [selectedSegment, setSelectedSegment] = useState(0);
	const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
	const [sidekyk, setSidekyk] = useState<CreateSidekykBody>({
		name: prevSidekyk?.name ?? "",
		color: prevSidekyk?.color ?? randomColor({ format: "hex" }) ?? "#fdba74",
		emoji: prevSidekyk?.emoji ?? "",
		avatar_name: "",
		avatar_url: prevSidekyk?.avatar_url ?? "",
		personality_id: prevSidekyk?.personality_id ?? 1,
		instruction: prevSidekyk?.instruction ?? "",
	});

	const [errors, setErrors] = useState<ValidationErrors<CreateSidekykBody>>(null);

	function handleUpdate<T extends keyof CreateSidekykBody>(key: T, value: Required<CreateSidekykBody>[T]) {
		if (!!errors?.[key]) {
			setErrors((prev) => ({ ...prev, [key]: "" }));
		}
		setSidekyk((prev) => ({ ...prev, [key]: value }));
	}

	function handleColorPickerResult({ hex }: returnedResults) {
		const color = hex as `#${string}`;
		handleUpdate("color", color);
	}

	async function handleSubmit() {
		try {
			setCreating(true);
			setErrors(null);
			let response;
			if (!!prevSidekyk) {
				response = await api.patch<CustomApiResponse<CreateSidekykResponse>>(`/sidekyk/${prevSidekyk.sidekyk_id}`, sidekyk);
			} else {
				response = await api.post<CustomApiResponse<CreateSidekykResponse>>("/sidekyk", sidekyk);
			}
			const { errors, error } = unwrapHTTPError<CreateSidekykResponse>(response.data);
			if (errors) {
				return setErrors(errors);
			}
			if (error) throw new AppException(error);

			if (!response.data?.data) {
				throw new AppException("Something went wrong while creating your Sidekyk. Please try again later.");
			}

			return navigation.replace("Details", { data: response.data?.data });
		} catch (e) {
			showErrorAlert(e);
		} finally {
			setCreating(false);
		}
	}

	useEffect(() => {
		if (avatars && avatars.length > 0 && !sidekyk.avatar_name && !prevSidekyk?.avatar_url) {
			setSelectedAvatar(avatars[0]);
		}
	}, [avatars]);

	useEffect(() => {
		if (selectedAvatar) {
			handleUpdate("avatar_name", selectedAvatar.name);
			handleUpdate("avatar_url", selectedAvatar.url);
		}
	}, [selectedAvatar]);

	if (isLoadingAvatars) {
		return (
			<Box bg="bg" flex={1} alignItems="center" justifyContent="center">
				<Spinner />
				<Text fontSize="sm" mt="md">
					Loading avatars...
				</Text>
			</Box>
		);
	}

	return (
		<SafeView forceInset={{ top: "never", bottom: "never" }} avoidKeyboard isModal>
			<ScrollView flex={1} px="container" pt="lg">
				<Box alignItems="center" mt="base" mb="xl">
					<CustomPressable onPress={() => setIsColorPickerVisible(true)} style={{ alignSelf: "center" }}>
						<ProfileImage bg={(sidekyk.color as unknown as any) ?? "primary"} uri={selectedAvatar?.url ?? prevSidekyk?.avatar_url} padding={48} />
					</CustomPressable>
					<Text fontSize="sm" opacity={0.3} mt="md">
						Tap to change color
					</Text>
				</Box>

				<Box mb="lg" nobg>
					<SegmentedControl
						values={["Details", "Appearance"]}
						selectedIndex={selectedSegment}
						appearance={colorScheme}
						onChange={(e) => {
							setSelectedSegment(e.nativeEvent.selectedSegmentIndex);
						}}
					/>
				</Box>

				<Box pb="3xl">
					{selectedSegment == Segments.DETAILS ? (
						<DetailsSegment data={sidekyk} errors={errors} onChange={handleUpdate} />
					) : selectedSegment == Segments.APPEARANCE ? (
						<AppearanceSegment selectedAvatar={selectedAvatar} avatars={avatars ?? []} setSelectedAvatar={setSelectedAvatar} selectedSegment={selectedSegment} segment={1} />
					) : null}
				</Box>
			</ScrollView>

			<Box width="100%" px="container" style={{ position: "absolute", bottom: 48 }}>
				<Button onPress={async () => await handleSubmit()} isLoading={creating} enableHaptics>
					{prevSidekyk ? "Save" : "Continue"}
				</Button>
			</Box>

			<ColorPicker visible={isColorPickerVisible} currentColor={sidekyk.color as `#${string}`} setVisible={setIsColorPickerVisible} onComplete={handleColorPickerResult} />
		</SafeView>
	);
}
