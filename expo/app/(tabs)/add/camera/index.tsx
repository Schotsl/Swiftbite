import PageCamera from "@/components/Page/Camera";

import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AddCameraLayout() {
  const router = useRouter();

  const { title, content } = useLocalSearchParams<{
    // By redirecting with the title and content we can keep the same state when returning from the estimation screen
    title?: string;
    content?: string;
  }>();

  const handleBarcode = (barcode: string) => {
    router.push({
      pathname: "/add/add-product",
      params: { barcode },
    });
  };

  const handleEstimation = (uri: string, width: number, height: number) => {
    router.push({
      pathname: "/add/add-estimation",
      params: { uri, width, height, title, content },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />

      <PageCamera onBarcode={handleBarcode} onEstimation={handleEstimation} />
    </View>
  );
}
