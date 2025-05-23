// HAPPY

import TextBody from "@/components/Text/Body";
import DecorativeNoise from "@/components/Decorative/Noise";

import variables from "@/variables";

import { TouchableOpacity } from "react-native";

type InputWeekdayItemProps = {
  error: boolean;
  weekday: string;
  selected: boolean;
  onPress: () => void;
};

export default function InputWeekdayItem({
  error,
  weekday,
  selected,
  onPress,
}: InputWeekdayItemProps) {
  const firstLetter = weekday.charAt(0);
  const firstUpper = firstLetter.toUpperCase();

  let color = variables.colors.text.secondary;
  let border = variables.border.color;
  let background = variables.colors.white;

  if (selected) {
    color = variables.colors.text.secondary;
    border = "transparent";
    background = variables.colors.background.secondary;
  }

  if (error) {
    color = "#7C0000";
    border = "#7C0000";
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        width: 36,
        height: 36,

        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",

        borderColor: border,
        borderWidth: variables.border.width,
        borderRadius: 36,

        backgroundColor: background,
      }}
    >
      <TextBody weight="bold" color={color}>
        {firstUpper}
      </TextBody>

      {selected && <DecorativeNoise />}
    </TouchableOpacity>
  );
}
