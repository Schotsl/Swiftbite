import { TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

type CameraShortcutsButtonProps = {
  iconMaterial?: keyof typeof MaterialIcons.glyphMap;
  iconAwesome?: keyof typeof FontAwesome6.glyphMap;
  expand?: boolean;

  onPress: () => void;
};

export default function CameraShortcutsButton({
  iconMaterial,
  iconAwesome,
  expand = false,
  onPress,
}: CameraShortcutsButtonProps) {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 18,

        width: 36,
        height: 36,

        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",

        marginRight: expand ? "auto" : 0,
      }}
      onPress={onPress}
      activeOpacity={1}
    >
      {iconMaterial && (
        <MaterialIcons name={iconMaterial} color="#fff" size={16} />
      )}

      {iconAwesome && (
        <FontAwesome6 name={iconAwesome} color="#fff" size={16} />
      )}
    </TouchableOpacity>
  );
}
