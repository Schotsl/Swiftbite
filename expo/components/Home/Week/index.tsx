import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";

import weekData from "@/queries/weekData";
import HomeWeekDay from "./Day";

const getLetter = (date: Date): string => {
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
  return weekdays[date.getDay()];
};

type HomeWeekProps = {
  date: Date;
  focus: boolean;
  onPress: (date: Date) => void;
};

export default function HomeWeek({ date, focus, onPress }: HomeWeekProps) {
  const { data } = useQuery({
    ...weekData(),
    enabled: focus,
  });

  const dateArray = [];
  const dateNumber = date.getDate();
  const today = new Date();

  for (let i = -3; i <= 3; i++) {
    const dateObject = new Date(date);

    dateObject.setDate(dateNumber + i);

    const dateString = dateObject.toISOString().split("T")[0];

    const isToday = dateObject.toDateString() === today.toDateString();
    const isIncluded = Array.isArray(data) && data.includes(dateString);

    let type: "thick" | "normal" | "dashed" = "normal";
    if (isToday) {
      type = "thick";
    } else if (!isIncluded) {
      type = "dashed";
    }

    dateArray.push({
      isToday,
      dateNumber: dateObject.getDate(),
      dateObject: dateObject,
      dateLetter: getLetter(dateObject),
      type,
    });
  }

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {dateArray.map((day, index) => (
        <HomeWeekDay
          key={index}
          type={day.type}
          date={day.dateNumber}
          weekday={day.dateLetter}
          onPress={() => onPress(day.dateObject)}
        />
      ))}
    </View>
  );
}
