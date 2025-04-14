import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type ButtonProps = {
  onPress: () => void;

  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  action?: "primary" | "delete";
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  onPress,

  icon,
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
      style={{
        width: "100%",
        opacity: disabled || loading ? 0.6 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
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
          {icon && <Ionicons name={icon} size={18} color="#fff" />}

          <Text
            style={{
              color: action === "delete" ? "#7C0000" : "#000",

              textAlign: "center",
              fontSize: 16,
              fontWeight: "semibold",
            }}
          >
            {title}
          </Text>
        </View>
      )}

      <View
        style={{
          position: "absolute",

          left: 4,
          top: 4,
          backgroundColor: action === "delete" ? "#7C0000" : "#000",
          width: "100%",
          height: "100%",
          borderRadius: 8,
          zIndex: -1,
        }}
      ></View>
    </TouchableOpacity>
  );
}
