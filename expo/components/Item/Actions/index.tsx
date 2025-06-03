import Text from "@/components/Text";
import React from "react";

import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

import variables from "@/variables";
import language from "@/language";

type ItemActionsProps = {
  onDelete: () => void;
  onDuplicate?: () => void;
};

export default function ItemActions({
  onDelete,
  onDuplicate,
}: ItemActionsProps) {
  const width = onDuplicate ? 150 : 75;
  const color = onDuplicate
    ? variables.colors.text.duplicate
    : variables.colors.text.error;

  return (
    <View
      style={{
        right: 0,
        width: "100%",
        height: 75,
        position: "absolute",
        flexDirection: "row",
        justifyContent: "flex-end",
        backgroundColor: color,
      }}
    >
      {onDuplicate && (
        <ItemActionsButton
          onPress={onDuplicate}
          color={variables.colors.text.duplicate}
          title={language.modifications.uppercase.duplicate}
          icon="copy"
        />
      )}

      <ItemActionsButton
        onPress={onDelete}
        color={variables.colors.text.error}
        title={language.modifications.uppercase.delete}
        icon="trash"
      />

      {/* Shadow hack taken from https://github.com/facebook/react-native/issues/2255#issuecomment-352336392 */}
      <View
        style={{
          top: 0,
          width,
          height: 10,
          position: "absolute",
          marginTop: -10,
          alignSelf: "center",
          backgroundColor: "rgb(48, 47, 60)",

          shadowColor: "rgba(0, 0, 0, 0.1)",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowRadius: 3,
          shadowOpacity: 1,
        }}
      />
    </View>
  );
}

type ItemActionsButtonProps = {
  icon: keyof typeof FontAwesome6.glyphMap;
  title: string;
  color: string;
  onPress: () => void;
};

function ItemActionsButton({
  onPress,
  icon,
  title,
  color,
}: ItemActionsButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        gap: 8,
        width: 75,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color,
      }}
    >
      <FontAwesome6 name={icon} size={20} color={variables.colors.white} />

      <Text weight="semibold" color={variables.colors.white} size={10}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
