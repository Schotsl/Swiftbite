import { FontAwesome6 } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

import variables from "@/variables";
import TextBody from "@/components/Text/Body";
import TextSmall from "@/components/Text/Small";

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

        borderColor: variables.border.color,
        borderBottomWidth: last ? 0 : variables.border.width,
      }}
    >
      <View
        style={{
          gap: 4,
        }}
      >
        <TextBody weight="semibold">{title}</TextBody>
        <TextSmall color={variables.colors.text.secondary} weight="medium">
          {content}
        </TextSmall>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        icon && (
          <FontAwesome6
            name={icon}
            size={20}
            color={variables.colors.text.primary}
          />
        )
      )}
    </TouchableOpacity>
  );
}
