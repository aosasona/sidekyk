import { AppException, showErrorAlert } from "../error";
import RNFS from "react-native-fs";
import Share, { ShareOptions } from "react-native-share";
import { getAccessToken } from "../requests/token";
import { api } from "../requests/defaults";

export async function downloadUserData({ fname, lname }: { fname: string; lname: string }): Promise<string | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new AppException("You don't seem to be logged in.");
  }
  const filePath = `${RNFS.DocumentDirectoryPath}/${fname}_${lname}.json`;

  const res = await api.get("/user/export", { download: true });
  if (!res.ok) throw new AppException((res?.data as any)?.error ?? "Failed to download user data");
  await RNFS.writeFile(filePath, JSON.stringify(res.data), "utf8");
  return filePath;
}

export async function shareUserData(filePath: string) {
  try {
    const options: ShareOptions = {
      title: "Export user data",
      url: `file://${filePath}`,
      type: "application/json",
    };
    await Share.open(options);
  } catch (error) {
    console.error(error);
  }
}

export async function exportUserData({ firstName: fname, lastName: lname }: { firstName: string; lastName: string }) {
  try {
    const filePath = await downloadUserData({ fname, lname });
    if (!filePath) throw new AppException("Failed to download user data.");
    await shareUserData(filePath);
  } catch (error) {
    showErrorAlert(error);
  }
}
