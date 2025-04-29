import { View, Text } from "react-native";

import Label from "@/components/Input/Label";
import Slider from "@react-native-community/slider";

type InputMacroSliderProps = {
  type: "carbs" | "protein" | "fat";
  label: string;
  value: number;
  calories: number;
  onChange: (value: number) => void;
};

export default function InputMacroSlider({
  type,
  label,
  value,
  calories,
  onChange,
}: InputMacroSliderProps) {
  let divider = 4;

  if (type === "protein") {
    divider = 4;
  } else if (type === "fat") {
    divider = 9;
  }

  const grams = (calories * value) / divider;
  const gramsRounded = Math.round(grams);

  const percentage = value * 100;
  const percentageRounded = Math.round(percentage);

  return (
    <View>
      <Label label={label} />
      <View
        style={{
          position: "relative",
          marginTop: -8,
          marginBottom: -4,
        }}
      >
        <Slider
          value={value}
          maximumValue={1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#FFFFFF"
          thumbTintColor="#000"
          onValueChange={onChange}
        />
        <View
          style={{
            top: 20,
            width: "100%",
            height: 10,
            zIndex: -1,
            position: "absolute",
            transform: [{ translateY: -5 }],

            borderWidth: 2,
            borderColor: "#000",
            borderRadius: 10,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "OpenSans_600SemiBold",
          }}
        >
          {percentageRounded}%
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "OpenSans_400Regular",
          }}
        >
          {gramsRounded} g
        </Text>
      </View>
    </View>
  );
}
