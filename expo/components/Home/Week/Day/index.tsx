// HAPPY

import TextBody from "@/components/Text/Body";

import { Day } from "../types";
import { getStyle } from "./helper";
import { TouchableOpacity, View } from "react-native";

import variables from "@/variables";

type HomeWeekDayProps = {
  day: Day;
  date: number;
  weekday: string;
  onPress: () => void;
};

export default function HomeWeekDay({
  day,
  date,
  weekday,
  onPress,
}: HomeWeekDayProps) {
  const style = getStyle(day);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        gap: variables.gap.small,
        alignItems: "center",
      }}
    >
      <View style={style}>
        <TextBody weight="bold">{weekday}</TextBody>
      </View>

      <TextBody weight="bold">{date}</TextBody>
    </TouchableOpacity>
  );
}
