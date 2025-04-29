import Label from "@/components/Input/Label";
import InputWeekdayItem from "./Item";

import { Text, View } from "react-native";
import { Control, useController } from "react-hook-form";

type InputWeekdayProps = {
  name: string;
  label: string;
  control: Control<any>;
};

export default function InputWeekday({
  name,
  label,
  control,
}: InputWeekdayProps) {
  const {
    field: { value, onChange },
    fieldState,
  } = useController({
    name,
    control,
  });

  const handleSelect = (weekday: string) => {
    // If the weekday is already in the array we'll remove it
    if (value.includes(weekday)) {
      const filtered = value.filter((needle: string) => needle !== weekday);

      onChange(filtered);

      return;
    }

    // Otherwise we'll add it to the array
    onChange([...value, weekday]);
  };

  const weekdays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <View>
      <Label label={label} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {weekdays.map((weekday) => (
          <InputWeekdayItem
            key={weekday}
            error={!!fieldState.error}
            weekday={weekday}
            selected={value.includes(weekday)}
            onPress={() => {
              handleSelect(weekday);
            }}
          />
        ))}
      </View>

      {fieldState.error && (
        <Text
          style={{
            fontSize: 14,
            fontFamily: "OpenSans_600SemiBold",

            color: "#7C0000",
            marginTop: 8,
          }}
        >
          {fieldState.error?.message}
        </Text>
      )}
    </View>
  );
}
