import { View } from "react-native";

type HomeProgressCircleProps = {
  progress: number;
};

export default function HomeProgressCircle({
  progress,
}: HomeProgressCircleProps) {
  const degrees = progress * 230 + 20;

  return (
    <View
      style={{
        height: 82,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <View
        style={{
          top: 8,
          left: 8,
          zIndex: 2,

          width: 96,
          height: 96,
          position: "absolute",

          borderRadius: 100,
          backgroundColor: "#fff",
        }}
      ></View>

      <View
        style={{
          top: 55,
          width: 56,
          height: 2,
          zIndex: 1,

          position: "absolute",
          backgroundColor: "#000",

          transform: [{ rotate: "-25deg" }],
          transformOrigin: "right",
        }}
      >
        <View
          style={{
            width: "100%",
            height: 2,
            backgroundColor: "#000",
          }}
        ></View>
        <View
          style={{
            width: "100%",
            height: 54,
            backgroundColor: "#fff",
          }}
        ></View>
      </View>

      <View
        style={{
          top: 55,
          right: 0,
          width: 56,
          height: 2,
          zIndex: 1,

          position: "absolute",
          backgroundColor: "#fff",

          transform: [{ rotate: "25deg" }],
          transformOrigin: "left",
        }}
      >
        <View
          style={{
            width: "100%",
            height: 2,
            backgroundColor: "#000",
          }}
        ></View>
        <View
          style={{
            width: "100%",
            height: 54,
            backgroundColor: "#fff",
          }}
        ></View>
      </View>

      <View
        style={{
          borderWidth: 2,
          borderColor: "#000",
          borderRadius: 100,
        }}
      >
        <View
          style={{
            borderLeftColor: "transparent",
            borderTopColor: progress > 0.5 ? "#000" : "transparent",
            borderRightColor: progress > 0.25 ? "#000" : "transparent",

            borderWidth: 4,
            borderColor: "#000",
            borderRadius: 100,

            transform: [{ rotate: `${degrees}deg` }],
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderWidth: 2,
              borderRadius: 100,
              borderColor: "#000",
            }}
          ></View>
        </View>
      </View>
    </View>
  );
}
