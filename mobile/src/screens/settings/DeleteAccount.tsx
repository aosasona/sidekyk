import { useLayoutEffect, useState } from "react";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Back, Box, Button, Dropdown, Input, Label, SafeView, ScrollView, Text, TextArea } from "@sidekyk/components";
import useTheme from "@sidekyk/hooks/useTheme";
import { DeleteAccountRequest } from "@sidekyk/lib/types/generated";
import { SettingsStackScreenProps } from "@sidekyk/lib/types/navigation";
import { handleUnwrappedError, showErrorAlert, unwrapHTTPError } from "@sidekyk/lib/error";
import { useAuthStore } from "@sidekyk/stores";
import { deleteUser } from "@sidekyk/lib/requests/user";

const deletionReasons = {
  default: "I don't have any reason",
  price: "Too expensive",
  alternative: "Found an alternative",
  bugs: "Too many bugs",
  need: "I don't need it anymore",
  feat: "Not enough features",
  bad: "Bad experience",
  cs: "Bad customer service",
  confusing: "I don't understand how to use it",
  other: "Other (please specify)",
} as const;

type DeletionReason = keyof typeof deletionReasons;

export default function DeleteAccountScreen({ navigation }: SettingsStackScreenProps<"Delete Account">) {
  const {
    theme: { colors },
  } = useTheme();
  const authStore = useAuthStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <Back onPress={() => navigation.goBack()} />,
      headerRight: () => null,
    });
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [showReasonBox, setShowReasonBox] = useState(false);
  const [selectedReason, setSelectedReason] = useState<DeletionReason>("default");
  const [data, setData] = useState<DeleteAccountRequest>({
    password: "",
    reason: deletionReasons.default,
  });
  const [errors, setErrors] = useState<Partial<DeleteAccountRequest> | null>(null);

  function handleReasonChange(reason: DeletionReason) {
    setShowReasonBox(reason == "other");
    setSelectedReason(reason);
    if (reason == "other") {
      setData((prev) => ({ ...prev, reason: "" }));
      return;
    }
    setData((prev) => ({ ...prev, reason: deletionReasons[reason] }));
  }

  function handleSubmit() {
    Alert.alert(
      "Are you sure?",
      "If you choose to continue, your account will be scheduled for deletion and cannot be retrieved after permanent deletion.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, delete my account",
          style: "destructive",
          onPress: () => deleteAccount().then().catch(showErrorAlert),
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  async function deleteAccount() {
    try {
      setIsLoading(true);
      const res = await deleteUser(data);
      handleUnwrappedError(unwrapHTTPError(res as any), setErrors);
      return authStore.signOut().then().catch(showErrorAlert);
    } catch (e) {
      return showErrorAlert(e);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(key: keyof DeleteAccountRequest, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  }

  return (
    <SafeView isModal avoidKeyboard>
      <ScrollView flex={1} px="container" pt="lg">
        <Box>
          <Box flexDirection="row" alignItems="center" bg="red.500" px="md" py="base" borderTopLeftRadius={10} borderTopRightRadius={10}>
            <Ionicons name="warning" size={18} color={colors.red[100]} />
            <Text color="red.100" fontSize="sm" fontWeight="bold" ml="xs">
              READ BEFORE PROCEEDING
            </Text>
          </Box>
          <Box bg="red.200" p="md" borderWidth={1} borderColor="red.500" borderBottomLeftRadius={10} borderBottomRightRadius={10}>
            <Text color="red.600" fontSize="sm" lineHeight="20px">
              You will not be able to recover your account or any of the data associated with it after permanent deletion which would take a few days to complete. You can retain a
              copy of your data by exporting it in the previous screen before deleting your account.
            </Text>
          </Box>
        </Box>

        <Box mt="lg">
          <Label>Password</Label>
          <Input value={data.password} onChangeText={(v) => handleChange("password", v)} validationError={errors?.password} secureTextEntry />
        </Box>

        <Box mt="lg">
          <Label>Reason</Label>
          <Dropdown
            items={Object.keys(deletionReasons) as (keyof typeof deletionReasons)[]}
            selectedItem={selectedReason}
            renderListItem={({ item }) => deletionReasons[item as DeletionReason]}
            renderSelectedItem={(_) => deletionReasons[selectedReason]}
            determineSelected={(item) => item == selectedReason}
            onSelect={(item) => handleReasonChange(item as DeletionReason)}
          />
        </Box>

        {showReasonBox ? (
          <Box mt="lg">
            <Label>Tell us more</Label>
            <TextArea numberOfLines={254} paddingX="md" paddingY="md" onChangeText={(v) => handleChange("reason", v)} validationError={errors?.reason} />
          </Box>
        ) : null}

        <Button mt="xl" onPress={handleSubmit} isLoading={isLoading}>
          Delete Account
        </Button>

        <Box height={250} />
      </ScrollView>
    </SafeView>
  );
}
