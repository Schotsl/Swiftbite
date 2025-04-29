import { Text, TouchableOpacity } from "react-native";

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
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        width: 36,
        height: 36,

        alignItems: "center",
        justifyContent: "center",

        borderRadius: 18,
        borderColor: error ? "#7C0000" : "#000",
        borderWidth: selected ? 3 : 2,
        backgroundColor: selected ? "#E5E5E5" : "#FFFFFF",
      }}
    >
      <Text
        style={{
          color: error ? "#7C0000" : "#000",
          fontSize: 16,
          fontFamily: "OpenSans_600SemiBold",
        }}
      >
        {firstUpper}
      </Text>
    </TouchableOpacity>
  );
}
