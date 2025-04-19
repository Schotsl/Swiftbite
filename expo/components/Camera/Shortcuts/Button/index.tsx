import { View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

type CameraShortcutsButtonProps = {
  icon?: keyof typeof FontAwesome6.glyphMap;
  expand?: boolean;
  onPress: () => void;
};

export default function CameraShortcutsButton({
  icon,
  expand = false,
  onPress,
}: CameraShortcutsButtonProps) {
  return (
    <View
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
    >
      <FontAwesome6 name={icon} color="#fff" size={16} />
    </View>
  );
}
