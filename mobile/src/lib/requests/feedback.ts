import { IS_ANDROID } from "../constants";
import { SendFeedbackRequest } from "../types/generated";

export async function sendFeedback(content: string, feedbackType: SendFeedbackRequest["type"]) {
  const data: SendFeedbackRequest = {
    content,
    type: feedbackType,
    source: IS_ANDROID ? "android" : "ios",
  };
}
