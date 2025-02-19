import { Image } from "react-native";
import { View, Text } from "react-native";
import SkeletonContent from "react-native-skeleton-content";

type ItemProps = {
  kcal?: number;
  title?: string;
};

export default function Item({ kcal, title }: ItemProps) {
  return (
    <View
      style={{
        gap: 12,
        padding: 16,
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
      }}
    >
      <Image
        source={require("../assets/images/burger.png")}
        style={{ width: 38, height: 38 }}
      />

      <View style={{ gap: 2 }}>
        <Text style={{ fontSize: 16 }}>{title ? title : "Loading..."}</Text>
        <Text style={{ fontSize: 14 }}>{kcal ? kcal : "Loading..."} kcal</Text>
      </View>
    </View>
  );
}
