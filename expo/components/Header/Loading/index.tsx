import Skeleton from "react-native-reanimated-skeleton";
import ButtonSmall from "@/components/Button/Small";

import { View } from "react-native";
import { useRouter } from "expo-router";

import variables from "@/variables";

export default function HeaderLoading() {
  const router = useRouter();

  return (
    <View
      style={{
        gap: 18,
        flexDirection: "column",
      }}
    >
      <ButtonSmall
        icon="arrow-left"
        style={{ marginRight: "auto" }}
        onPress={() => router.back()}
      />

      <Skeleton
        isLoading={true}
        containerStyle={{ gap: variables.gap.small }}
        layout={[
          { key: "title", width: 220, height: 32, marginBottom: 6 },
          { key: "content", width: 180, height: 20, marginBottom: 6 },
        ]}
      />
    </View>
  );
}
