import { View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

import TextBody from "@/components/Text/Body";

type ProductInfoProps = {
  items: {
    key: string;
    icon: keyof typeof FontAwesome6.glyphMap;
    value: string;
  }[];
};

export default function ProductInfo({ items }: ProductInfoProps) {
  return (
    <View style={{ gap: 8 }}>
      {items.map((item) => (
        <View
          key={item.key}
          style={{ gap: 8, alignItems: "center", flexDirection: "row" }}
        >
          <FontAwesome6 name={item.icon} size={16} color="#404040" />

          <TextBody color="#404040" weight="semibold">
            {item.value}
          </TextBody>
        </View>
      ))}
    </View>
  );
}
