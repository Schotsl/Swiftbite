import Icon from "../Icon";

import { FontAwesome6 } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useState, Fragment } from "react";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";

type BaseProps = {
  title: string;
  subtitle: string;

  small?: boolean;
  border?: boolean;
  iconId?: string | null;
  rightTop?: string | null;
  rightBottom?: string | null;
  subtitleIcon?: string;
  subtitleLoading?: boolean;
};

type LinkProps = {
  href: Href;
  onPress?: never;
};

type ButtonProps = {
  href?: never;
  onPress: () => void;
};

type ItemProps = BaseProps & (LinkProps | ButtonProps);

export default function Item({
  title,
  subtitle,

  href,
  onPress,
  small = false,
  border = true,
  subtitleIcon,
  subtitleLoading = false,
  iconId,

  rightTop,
  rightBottom,
}: ItemProps) {
  const [width, setWidth] = useState(0);

  const gap = 16;
  const icon = iconId ? 42 + 16 : 0;
  const right = 75;
  const padding = small ? 20 : 32;
  const remaining = width - right - gap - icon - padding * 2;

  const handlePress = () => {
    if (href) {
      router.push(href);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1}>
      <View
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;

          setWidth(width);
        }}
        style={{
          height: 75,
          minWidth: "100%",
          borderWidth: border ? 2 : 0,
          flexDirection: "column",
          paddingVertical: 16,
          paddingHorizontal: padding,
          borderTopWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            gap,
            height: "100%",
            minWidth: "100%",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {/* If iconId is null it's still loading the ID */}
          {typeof iconId !== "undefined" && <Icon iconId={iconId} />}

          <View
            style={{
              height: "100%",
              maxWidth: remaining,
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "OpenSans_600SemiBold",
              }}
              numberOfLines={1}
            >
              {title}
            </Text>

            <View
              style={{
                gap: 6,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <View
                style={{
                  width: 13,
                  height: 13,
                  justifyContent: "center",
                }}
              >
                {!subtitleLoading ? (
                  <ActivityIndicator
                    size="small"
                    style={{ transform: [{ scale: 0.65 }] }}
                    color="#000000"
                  />
                ) : (
                  <Fragment>
                    {subtitleIcon && (
                      <FontAwesome6
                        name={subtitleIcon}
                        size={12}
                        style={{ opacity: 0.75, backgroundColor: "red" }}
                        color="#545454"
                      />
                    )}
                  </Fragment>
                )}
              </View>

              <Text
                style={{
                  color: "#545454",
                  fontSize: 14,
                  fontFamily: "OpenSans_400Regular",
                }}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              minWidth: right,
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: "#000000",
                fontSize: 16,
                fontFamily: "OpenSans_600SemiBold",
              }}
              numberOfLines={1}
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
              numberOfLines={1}
            >
              {rightBottom}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
