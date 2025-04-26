import HomeWeekDay from "./Day";
import { View } from "react-native";

const getLetter = (date: Date): string => {
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
  return weekdays[date.getDay()];
};

type HomeWeekProps = {
  date: Date;
  onPress: (date: Date) => void;
};

export default function HomeWeek({ date, onPress }: HomeWeekProps) {
  const dateArray = [];
  const dateNumber = date.getDate();

  for (let i = -3; i <= 3; i++) {
    const object = new Date(date);

    object.setDate(dateNumber + i);

    dateArray.push({
      isToday: i === 0,
      dateNumber: object.getDate(),
      dateObject: object,
      dateLetter: getLetter(object),
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
          type={day.isToday ? "thick" : "normal"}
          date={day.dateNumber}
          weekday={day.dateLetter}
          onPress={() => onPress(day.dateObject)}
        />
      ))}
    </View>
  );
}
