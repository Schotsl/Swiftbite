import { FontAwesome6 } from "@expo/vector-icons";
import { Text, View } from "react-native";

import Icon from "./Icon";

type NewItemProps = {
  small?: boolean;
  border?: boolean;
  title: string;
  subtitle: string;
  subtitleIcon?: string;
  iconId?: string;
  rightTop?: string;
  rightBottom?: string;
};

export default function ItemNew({
  small = false,
  border = true,
  title,
  subtitle,
  subtitleIcon,
  iconId,
  rightTop,
  rightBottom,
}: NewItemProps) {
  return (
    <View
      style={{
        minWidth: "100%",
        borderWidth: border ? 2 : 0,
        flexDirection: "column",
        paddingVertical: 16,
        paddingHorizontal: small ? 16 : 32,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
      }}
    >
      <View
        style={{
          gap: 16,
          minWidth: "100%",

          alignItems: "center",
          flexDirection: "row",
        }}
      >
        {iconId && <Icon iconId={iconId} />}

        <View style={{ gap: 4 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "semibold",
            }}
          >
            {title}
          </Text>

          <View style={{ flexDirection: "row", gap: 6 }}>
            {subtitleIcon && (
              <FontAwesome6 name={subtitleIcon} size={14} color="#545454" />
            )}

            <Text
              style={{
                fontSize: 14,
                fontWeight: "regular",
                color: "#545454",
              }}
            >
              {subtitle}
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <Text
            style={{
              color: "#000000",
              fontSize: 16,
              fontWeight: "semibold",
            }}
          >
            {rightTop}
          </Text>

          <View style={{ flex: 1 }}></View>

          <Text
            style={{
              color: "#545454",
              fontSize: 14,
              fontWeight: "regular",
            }}
          >
            {rightBottom}
          </Text>
        </View>
      </View>
    </View>
  );
}
