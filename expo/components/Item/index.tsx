import { FontAwesome6 } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import Icon from "../Icon";

type NewItemProps = {
  title: string;
  subtitle: string;

  href?: Href;
  small?: boolean;
  border?: boolean;
  iconId?: string | null;
  rightTop?: string;
  rightBottom?: string;
  subtitleIcon?: string;
};

export default function Item({
  href,
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
    <TouchableOpacity
      onPress={() => href && router.push(href)}
      activeOpacity={1}
    >
      <View
        style={{
          height: 75,
          minWidth: "100%",
          borderWidth: border ? 2 : 0,
          flexDirection: "column",
          paddingVertical: 16,
          paddingHorizontal: small ? 16 : 32,
          borderTopWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            gap: 16,
            height: "100%",
            minWidth: "100%",

            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {/* If iconId is null it's still loading the ID */}
          {typeof iconId !== "undefined" && <Icon iconId={iconId} />}

          <View
            style={{ gap: 4, height: "100%", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "OpenSans_600SemiBold",
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
                  fontFamily: "OpenSans_400Regular",
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
                fontFamily: "OpenSans_600SemiBold",
              }}
            >
              {rightTop}
            </Text>

            <View style={{ flex: 1 }}></View>

            <Text
              style={{
                color: "#545454",
                fontSize: 14,
                fontFamily: "OpenSans_400Regular",
              }}
            >
              {rightBottom}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
