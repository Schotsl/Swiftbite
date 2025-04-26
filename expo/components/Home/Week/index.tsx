import HomeWeekDay from "./Day";

import { View } from "react-native";

export default function HomeWeek() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <HomeWeekDay type="dashed" date={18} weekday="M" />
      <HomeWeekDay type="dashed" date={19} weekday="D" />
      <HomeWeekDay type="normal" date={20} weekday="W" />
      <HomeWeekDay type="thick" date={21} weekday="D" />
      <HomeWeekDay type="normal" date={22} weekday="F" />
      <HomeWeekDay type="normal" date={22} weekday="S" />
      <HomeWeekDay type="normal" date={31} weekday="S" />
    </View>
  );
}
