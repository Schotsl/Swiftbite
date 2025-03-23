import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type ButtonProps = {
  onPress: () => void;

  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  onPress,

  icon,
  title,
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

        alignItems: "center",
        justifyContent: "center",

        borderRadius: 16,
        backgroundColor: "#405cf5",

        paddingVertical: 16,
        paddingHorizontal: 32,
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <View style={{ gap: 8, alignItems: "center", flexDirection: "row" }}>
          {icon && <Ionicons name={icon} size={18} color="#fff" />}

          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
