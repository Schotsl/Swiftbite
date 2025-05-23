import variables from "@/variables";
import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

type EstimationImageButtonProps = {
  icon: keyof typeof FontAwesome6.glyphMap;

  onPress: () => void;
};

export default function EstimationImageButton({
  icon,

  onPress,
}: EstimationImageButtonProps) {
  return (
    <TouchableOpacity
      style={{
        width: 32,
        height: 32,

        borderRadius: 100,
        borderColor: variables.border.color,
        borderWidth: variables.border.width,

        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
      onPress={onPress}
    >
      <FontAwesome6
        name={icon}
        size={14}
        color={variables.colors.text.primary}
      />
    </TouchableOpacity>
  );
}
