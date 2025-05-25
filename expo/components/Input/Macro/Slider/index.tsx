import { View } from "react-native";
import { macroToCalories } from "@/helper";

import Label from "@/components/Input/Label";
import Slider from "@react-native-community/slider";
import TextSmall from "@/components/Text/Small";

import variables from "@/variables";

type InputMacroSliderProps = {
  type: "carbs" | "protein" | "fat";
  label: string;
  value: number;
  calories: number;
  background: string;
  onChange: (value: number) => void;
};

export default function InputMacroSlider({
  type,
  label,
  value,
  calories,
  background,
  onChange,
}: InputMacroSliderProps) {
  const grams = macroToCalories(type, value, calories);

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
          thumbTintColor={background}
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
            borderColor: variables.border.color,
            borderWidth: 2,
            borderRadius: variables.border.radius,
          }}
        />
      </View>

      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TextSmall weight="semibold">{percentageRounded}%</TextSmall>

        <TextSmall>{grams} g</TextSmall>
      </View>
    </View>
  );
}
