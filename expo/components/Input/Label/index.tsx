import TextBody from "@/components/Text/Body";
import variables from "@/variables";

import { View } from "react-native";

type InputLabelProps = {
  label: string;
  required?: boolean;
};

export default function InputLabel({
  label,
  required = true,
}: InputLabelProps) {
  return (
    <View
      style={{
        gap: 4,
        alignItems: "flex-end",
        marginBottom: variables.input.margin,
        flexDirection: "row",
      }}
    >
      <TextBody weight="semibold">{label}</TextBody>

      {!required && (
        <TextBody
          color={variables.colors.greyDark}
          style={{ top: -1, fontSize: 10 }}
          weight="semibold"
        >
          (optioneel)
        </TextBody>
      )}
    </View>
  );
}
