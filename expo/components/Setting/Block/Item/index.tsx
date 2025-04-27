import { Href, useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type SettingBlockItemBaseProps = {
  last: boolean;
  icon?: keyof typeof FontAwesome6.glyphMap;
  title: string;
  content: string;
  loading?: boolean;
};

type SettingBlockItemWithHref = SettingBlockItemBaseProps & {
  href: Href;
  onPress?: never;
};

type SettingBlockItemWithOnPress = SettingBlockItemBaseProps & {
  onPress: () => void;
  href?: never;
};

type SettingBlockItemProps =
  | SettingBlockItemWithHref
  | SettingBlockItemWithOnPress;

export default function SettingBlockItem({
  last = false,
  icon,
  href,
  title,
  content,
  loading = false,
  onPress,
}: SettingBlockItemProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={onPress ? onPress : () => router.push(href)}
      style={{
        padding: 16,
        paddingRight: 32,

        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",

        borderColor: "#000",
        borderBottomWidth: last ? 0 : 2,
      }}
    >
      <View
        style={{
          gap: 4,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "OpenSans_600SemiBold",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            opacity: 0.75,
            fontSize: 16,
            fontFamily: "OpenSans_400Regular",
          }}
        >
          {content}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        icon && <FontAwesome6 name={icon} size={20} color="#000" />
      )}
    </TouchableOpacity>
  );
}
