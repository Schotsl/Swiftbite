// HAPPY

import HomeWeekDay from "./Day";

import weekData from "@/queries/weekData";
import useSuspenseQueryFocus from "@/hooks/useSuspenseQueryFocus";

import { View } from "react-native";
import { getDay, getLetter } from "./helper";

type HomeWeekProps = {
  date: Date;
  onPress: (date: Date) => void;
};

export default function HomeWeek({ date, onPress }: HomeWeekProps) {
  const { data } = useSuspenseQueryFocus(weekData());

  const datesUsed = (data as string[] | undefined) || [];
  const datesArray = [];

  const today = new Date();
  const current = date.getDate();

  for (let i = -3; i <= 3; i++) {
    const dateItem = new Date(date);
    dateItem.setDate(current + i);

    const day = getDay(dateItem, today, date, datesUsed);

    datesArray.push({
      dateNumber: dateItem.getDate(),
      dateObject: dateItem,
      dateLetter: getLetter(dateItem),
      day,
    });
  }

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {datesArray.map(({ day, dateNumber, dateObject, dateLetter }, index) => (
        <HomeWeekDay
          key={index}
          day={day}
          date={dateNumber}
          weekday={dateLetter}
          onPress={() => {
            if (!day.isFuture) {
              onPress(dateObject);
            }
          }}
        />
      ))}
    </View>
  );
}
