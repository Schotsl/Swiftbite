// HAPPY

import TextBodyBold from "@/components/Text/Body/Bold";

import { Day } from "../types";
import { getStyle } from "./helper";
import { TouchableOpacity, View } from "react-native";

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
        gap: 8,
        alignItems: "center",
      }}
    >
      <View style={style}>
        <TextBodyBold>{weekday}</TextBodyBold>
      </View>

      <TextBodyBold>{date}</TextBodyBold>
    </TouchableOpacity>
  );
}
