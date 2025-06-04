import variables from "@/variables";

import ItemIcon from "./Icon";
import TextBody from "../Text/Body";
import TextSmall from "../Text/Small";

import { FontAwesome6 } from "@expo/vector-icons";
import { useState, Fragment } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

type ItemProps = {
  title: string;
  subtitle: string;

  small?: boolean;
  border?: boolean;
  iconId?: string | null;
  rightTop?: string | null;
  rightBottom?: string | null;
  subtitleIcon?: string;
  subtitleLoading?: boolean;

  onPress: () => void;
};

export default function Item({
  title,
  subtitle,

  small = false,
  border = true,
  subtitleIcon,
  subtitleLoading = false,
  iconId,

  rightTop,
  rightBottom,

  onPress,
}: ItemProps) {
  const [width, setWidth] = useState(0);

  const gap = 16;
  const icon = iconId ? 42 + 16 : 0;
  const right = 75;
  const padding = small ? 20 : 32;
  const remaining = width - right - gap - icon - padding * 2;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <View
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;

          setWidth(width);
        }}
        style={{
          height: 75,
          minWidth: "100%",
          borderColor: variables.border.color,
          borderWidth: border ? 1 : 0,
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
          {typeof iconId !== "undefined" && <ItemIcon iconId={iconId} />}

          <View
            style={{
              height: "100%",
              maxWidth: remaining,
              justifyContent: "space-between",
            }}
          >
            <TextBody weight="semibold" truncate={true}>
              {title}
            </TextBody>

            <View
              style={{
                gap: 6,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              {(subtitleIcon || subtitleLoading) && (
                <View
                  style={{
                    width: 13,
                    height: 13,
                    justifyContent: "center",
                  }}
                >
                  {subtitleLoading ? (
                    <ActivityIndicator
                      size="small"
                      style={{ transform: [{ scale: 0.65 }] }}
                      color={variables.colors.text.primary}
                    />
                  ) : (
                    <Fragment>
                      {subtitleIcon && (
                        <FontAwesome6
                          name={subtitleIcon}
                          size={12}
                          color={variables.colors.text.secondary}
                        />
                      )}
                    </Fragment>
                  )}
                </View>
              )}

              <TextSmall
                color={variables.colors.text.secondary}
                weight="medium"
                truncate={true}
              >
                {subtitle}
              </TextSmall>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              width: right,
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <TextBody weight="semibold" truncate={true}>
              {rightTop}
            </TextBody>

            <View style={{ flex: 1 }}></View>

            <TextSmall
              color={variables.colors.text.secondary}
              weight="medium"
              truncate={true}
            >
              {rightBottom}
            </TextSmall>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
