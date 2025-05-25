import Text from "@/components/Text";
import TextBody from "@/components/Text/Body";

import language from "@/language";
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
        <Text
          size={10}
          color={variables.colors.greyDark}
          style={{ top: -1 }}
          weight="semibold"
        >
          ({language.input.optional})
        </Text>
      )}
    </View>
  );
}
