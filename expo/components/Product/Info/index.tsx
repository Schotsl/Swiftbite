import { Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

type ProductInfoProps = {
  items: {
    icon: keyof typeof FontAwesome6.glyphMap;
    value: string;
  }[];
};

export default function ProductInfo({ items }: ProductInfoProps) {
  return (
    <View style={{ gap: 8 }}>
      {items.map((item) => (
        <View
          key={item.value}
          style={{ gap: 8, alignItems: "center", flexDirection: "row" }}
        >
          <FontAwesome6 name={item.icon} size={16} color="#404040" />

          <Text
            style={{
              color: "#404040",
              fontSize: 16,
              fontFamily: "OpenSans_600SemiBold",
            }}
          >
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
