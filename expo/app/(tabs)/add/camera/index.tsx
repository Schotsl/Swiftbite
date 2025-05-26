import PageCamera from "@/components/Page/Camera";

import { View } from "react-native";
import { CameraSelected } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AddCameraLayout() {
  const router = useRouter();

  const { title, content, initial } = useLocalSearchParams<{
    // By redirecting with the title and content we can keep the same state when returning from the estimation screen
    title?: string;
    content?: string;
    initial?: CameraSelected;
  }>();

  const handleBarcode = (barcode: string) => {
    router.push({
      pathname: "/add/product",
      params: { barcode },
    });
  };

  const handleEstimation = (uri: string, width: number, height: number) => {
    router.push({
      pathname: "/add/estimation",
      params: { uri, width, height, title, content },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <PageCamera
        initial={initial}
        onBarcode={handleBarcode}
        onEstimation={handleEstimation}
      />
    </View>
  );
}
