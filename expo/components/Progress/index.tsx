import { DimensionValue, StyleProp, View, ViewStyle } from "react-native";

import variables from "@/variables";

import TextBody from "@/components/Text/Body";
import TextSmall from "@/components/Text/Small";

import DecorativeLinear from "../Decorative/Linear";
import DecorativeNoise from "../Decorative/Noise";

type ProgressProps = {
  type?: string;
  label: string;
  value: number;
  style?: StyleProp<ViewStyle>;
  target: number;
};

export default function Progress({
  type = "g",
  label,
  value,
  style,
  target,
}: ProgressProps) {
  const progress = (value / target) * 100;
  const progressRounded = Math.round(progress);
  const progressWidth = `${progressRounded}%` as DimensionValue;

  return (
    <View
      style={[
        { gap: variables.gap.small, flex: 1, alignItems: "center" },
        style,
      ]}
    >
      <TextBody weight="semibold">{label}</TextBody>

      <View
        style={{
          width: "100%",
          height: 11,
          position: "relative",

          borderColor: variables.colors.grey,
          borderWidth: variables.border.width,
          borderRadius: variables.border.radius,
          backgroundColor: variables.colors.grey,
        }}
      >
        <View
          style={{
            maxWidth: "100%",
            minWidth: variables.border.radius,

            overflow: "hidden",
            position: "absolute",

            width: progressWidth,
            height: variables.border.radius,
            borderRadius: variables.border.radius,
          }}
        >
          <DecorativeLinear />
          <DecorativeNoise />
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 4 }}>
        <TextSmall>
          {value}
          {type}
        </TextSmall>
        <TextSmall weight="semibold">/</TextSmall>
        <TextSmall weight="semibold">
          {target}
          {type}
        </TextSmall>
      </View>
    </View>
  );
}
