import { View } from "react-native";

import language from "@/language";

import Text from "@/components/Text";

export default function PageStatsChartsBackground() {
  return (
    <View
      style={{
        top: 10,
        left: 46,
        right: 0,
        bottom: 24,
        zIndex: -1,
        display: "flex",
        position: "absolute",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          width: `${(6 / 24) * 100}%`,
          height: "100%",
        }}
      />

      <View
        style={{
          width: `${(6 / 24) * 100}%`,
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.03)",
        }}
      >
        <View
          style={{
            alignSelf: "flex-start",
            justifyContent: "flex-start",
            transformOrigin: "right",
            transform: [{ rotate: "-90deg" }, { translateY: -34 }],
          }}
        >
          <Text size={12} align="right">
            {language.time.morning}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: `${(5 / 24) * 100}%`,
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.06)",
        }}
      >
        <View
          style={{
            alignSelf: "flex-start",
            justifyContent: "flex-start",
            transformOrigin: "right",
            transform: [{ rotate: "-90deg" }, { translateY: -28 }],
          }}
        >
          <Text size={12} align="right">
            {language.time.afternoon}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: `${(4 / 24) * 100}%`,
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.09)",
        }}
      >
        <View
          style={{
            alignSelf: "flex-start",
            justifyContent: "flex-start",
            transformOrigin: "right",
            transform: [{ rotate: "-90deg" }, { translateY: -22 }],
          }}
        >
          <Text size={12} align="right">
            {language.time.evening}
          </Text>
        </View>
      </View>
    </View>
  );
}
