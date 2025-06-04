import { Day } from "../types";
import { getStyle } from "./helper";
import { TouchableOpacity, View } from "react-native";

import variables from "@/variables";

import TextBody from "@/components/Text/Body";
import MaskedView from "@react-native-masked-view/masked-view";
import DecorativeLinear from "@/components/Decorative/Linear";
import DecorativeNoise from "@/components/Decorative/Noise";

type HomeWeekDayProps = {
  day: Day;
  date: number;
  weekday: string;
  onPress: () => void;
};

export default function HomeWeekDay({
  day,
  date,
  weekday,
  onPress,
}: HomeWeekDayProps) {
  const style = getStyle(day);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        // We need to hide the overflow of the mask so the touchable opacity doesn't become huge
        gap: 4,
        overflow: "hidden",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: variables.circle.small,
          height: variables.circle.small,
          borderRadius: variables.circle.small,

          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextBody weight="bold">{weekday}</TextBody>

        <MaskedView
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            position: "absolute",
          }}
          maskElement={
            <View
              style={[
                {
                  width: variables.circle.small,
                  height: variables.circle.small,
                  borderRadius: variables.circle.small,
                },
                style,
              ]}
            ></View>
          }
        >
          <View
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <DecorativeLinear />
            <DecorativeNoise />
          </View>
        </MaskedView>
      </View>

      <TextBody weight="bold">{date}</TextBody>
    </TouchableOpacity>
  );
}
