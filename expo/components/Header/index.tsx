import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import HeaderTitle from "./Title";

type HeaderProps = {
  title: string;
  small?: boolean;
  content?: string;
};

export default function Header({ title, small = false, content }: HeaderProps) {
  return (
    <View
      style={{
        gap: 12,
        flexDirection: "column",
        paddingBottom: small ? 24 : 48,
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          width: 36,
          height: 36,

          alignItems: "center",
          justifyContent: "center",

          borderRadius: 100,
          borderColor: "#000",
          borderWidth: 2,
        }}
      >
        <FontAwesome6 name="arrow-left" size={16} color="black" />
      </TouchableOpacity>

      <HeaderTitle>{title}</HeaderTitle>

      {content && (
        <Text style={{ fontSize: 16, fontWeight: "normal" }}>{content}</Text>
      )}
    </View>
  );
}
