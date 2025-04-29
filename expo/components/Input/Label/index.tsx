import { Text, View } from "react-native";

type InputLabelProps = {
  label: string;
  required?: boolean;
};

export default function InputLabel({
  label,
  required = true,
}: InputLabelProps) {
  return (
    <View
      style={{
        gap: 4,
        alignItems: "flex-end",
        marginBottom: 8,
        flexDirection: "row",
      }}
    >
      <Text
        style={{
          color: "#000",
          fontSize: 14,
          fontFamily: "OpenSans_600SemiBold",
        }}
      >
        {label}
      </Text>

      {!required && (
        <Text
          style={{
            top: -1,
            opacity: 0.75,
            fontSize: 10,
            fontFamily: "OpenSans_600SemiBold",
          }}
        >
          (optioneel)
        </Text>
      )}
    </View>
  );
}
