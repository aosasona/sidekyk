import { Button, Label, SafeView, ScrollView, TextArea } from "@sidekyk/components";
import { showErrorAlert } from "@sidekyk/lib/error";
import { sendFeedback } from "@sidekyk/lib/requests/feedback";
import { SettingsStackScreenProps } from "@sidekyk/lib/types/navigation";
import { useLayoutEffect, useState } from "react";

export default function FeedbackScreen({ navigation, route }: SettingsStackScreenProps<"Feedback">) {
  const type = route.params.type || "feedback";

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: type == "feedback" ? "Feedback" : "Report a bug",
    });
  }, []);

  function send() {
    setLoading(true);
    sendFeedback(content, type)
      .then()
      .catch(showErrorAlert)
      .finally(() => setLoading(false));
  }

  return (
    <SafeView forceInset={{ top: "never", bottom: "never" }} isModal>
      <ScrollView flex={1} px="container" pt="lg">
        <Label>{type == "feedback" ? "What do you want to tell us?" : "Describe the bug"}</Label>
        <TextArea height={250} value={content} onChangeText={setContent} maxLength={1000} placeholder="So..." enablesReturnKeyAutomatically />
        <Button mt="lg" disabled={loading || content?.trim()?.length < 5} onPress={send}>
          Send
        </Button>
      </ScrollView>
    </SafeView>
  );
}
