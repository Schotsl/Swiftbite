import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import {
  Text,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

export type ButtonProps = {
  onPress: () => void;

  icon?: keyof typeof FontAwesome6.glyphMap;
  style?: StyleProp<ViewStyle>;
  title: string;
  action?: "primary" | "delete";
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  onPress,

  icon,
  style,
  title,
  action = "primary",
  loading = false,
  disabled = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        {
          width: "100%",
          opacity: disabled || loading ? 0.6 : 1,
        },
        style,
      ]}
    >
      <View
        style={{
          gap: 8,
          flexDirection: "row",

          alignItems: "center",
          justifyContent: "center",

          paddingVertical: 12,
          paddingHorizontal: 32,

          borderRadius: 8,
          backgroundColor: "#fff",

          borderWidth: 2,
          borderColor: action === "delete" ? "#7C0000" : "#000",
        }}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={action === "delete" ? "#7C0000" : "#000"}
          />
        ) : (
          <FontAwesome6
            name={icon}
            size={18}
            color={action === "delete" ? "#7C0000" : "#000"}
          />
        )}

        <Text
          style={{
            color: action === "delete" ? "#7C0000" : "#000",

            textAlign: "center",
            fontSize: 16,
            fontFamily: "OpenSans_600SemiBold",
          }}
        >
          {title}
        </Text>
      </View>

      <View
        style={{
          top: 4,
          left: 4,
          width: "100%",
          height: "100%",
          zIndex: -1,
          position: "absolute",
          borderRadius: 8,
          backgroundColor: action === "delete" ? "#7C0000" : "#000",
        }}
      ></View>
    </TouchableOpacity>
  );
}
