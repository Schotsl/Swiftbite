// HAPPY

import Label from "@/components/Input/Label";
import TextSmall from "@/components/Text/Small";
import InputWeekdayItem from "./Item";

import { View } from "react-native";
import { Control, useController } from "react-hook-form";

import language from "@/language";
import variables from "@/variables";

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
    fieldState: { error },
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
    { value: "monday", title: language.weekdays.monday },
    { value: "tuesday", title: language.weekdays.tuesday },
    { value: "wednesday", title: language.weekdays.wednesday },
    { value: "thursday", title: language.weekdays.thursday },
    { value: "friday", title: language.weekdays.friday },
    { value: "saturday", title: language.weekdays.saturday },
    { value: "sunday", title: language.weekdays.sunday },
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
            key={weekday.value}
            error={!!error}
            weekday={weekday}
            selected={value.includes(weekday.value)}
            onPress={() => {
              handleSelect(weekday.value);
            }}
          />
        ))}
      </View>

      {error && (
        <TextSmall
          style={{ marginTop: variables.input.margin }}
          color={variables.colors.text.error}
          weight="semibold"
        >
          {error?.message}
        </TextSmall>
      )}
    </View>
  );
}
