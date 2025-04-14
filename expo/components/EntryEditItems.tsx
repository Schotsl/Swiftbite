import { FontAwesome6 } from "@expo/vector-icons";
import { Text, View } from "react-native";

type EntryEditItemsProps = {
  barcode?: string;
  quantity?: string;
};

export function EntryEditItems({ barcode, quantity }: EntryEditItemsProps) {
  return (
    <View style={{ gap: 8 }}>
      {barcode && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <FontAwesome6 name="barcode" size={16} color="#545454" />
          <Text
            style={{ fontSize: 16, fontWeight: "semibold", color: "#545454" }}
          >
            {barcode}
          </Text>
        </View>
      )}

      {quantity && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <FontAwesome6 name="cube" size={16} color="#545454" />
          <Text
            style={{ fontSize: 16, fontWeight: "semibold", color: "#545454" }}
          >
            {quantity}
          </Text>
        </View>
      )}
    </View>
  );
}
