import { DimensionValue, StyleProp, View, ViewStyle } from "react-native";
import variables from "@/variables";

import TextBody from "@/components/Text/Body";
import TextSmall from "@/components/Text/Small";

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
          height: 12,
          position: "relative",

          borderColor: variables.colors.grey,
          borderWidth: variables.border.width,
          borderRadius: variables.border.radius,
          backgroundColor: variables.colors.grey,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: progressWidth,
            height: variables.border.radius,
            maxWidth: "100%",
            position: "absolute",

            borderRadius: variables.border.radius,
            backgroundColor: variables.colors.primary,
          }}
        />
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
