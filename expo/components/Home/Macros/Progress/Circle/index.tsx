// HAPPY

import variables from "@/variables";

import MaskedView from "@react-native-masked-view/masked-view";
import DecorativeNoise from "@/components/Decorative/Noise";
import DecorativeLinear from "@/components/Decorative/Linear";

import { View } from "react-native";

type HomeMacrosProgressCircleProps = {
  progress: number;
};

export default function HomeMacrosProgressCircle({
  progress,
}: HomeMacrosProgressCircleProps) {
  const widthCircle = 124;
  const widthFiller = 8;
  const widthBorder = 2;

  const degreesDot = progress * 230 - 25;
  const degreesFiller = progress * 230 + 20;

  return (
    <View
      style={{
        width: widthCircle,
        height: widthCircle * 0.73,
      }}
    >
      <View
        style={{
          width: widthCircle,
          height: widthCircle,
          borderRadius: widthCircle,
          backgroundColor: variables.colors.grey,
        }}
      >
        {/* This is the inner circle that covers the center */}
        <View
          style={{
            top: widthBorder * 2 + widthFiller,
            left: widthBorder * 2 + widthFiller,
            zIndex: 2,

            width: widthCircle - widthBorder * 4 - widthFiller * 2,
            height: widthCircle - widthBorder * 4 - widthFiller * 2,
            position: "absolute",

            borderRadius: widthCircle,
            backgroundColor: variables.colors.white,
          }}
        />

        {/* This is the left arm */}
        <View
          style={{
            top: widthCircle / 2,

            width: widthCircle / 2,
            height: widthBorder,
            zIndex: 1,

            position: "absolute",
            transform: [{ rotate: "-25deg" }],
            transformOrigin: "right",
          }}
        >
          <View
            style={{
              width: "100%",
              height: widthBorder,
              backgroundColor: variables.colors.grey,
            }}
          />

          <View
            style={{
              width: "100%",
              height: widthCircle / 2 - widthBorder,
              backgroundColor: variables.colors.white,
            }}
          />
        </View>

        {/* This is the right arm */}
        <View
          style={{
            top: widthCircle / 2,
            left: widthCircle / 2,

            width: widthCircle / 2,
            height: widthBorder,
            zIndex: 1,

            position: "absolute",
            transform: [{ rotate: "25deg" }],
            transformOrigin: "left,top",
          }}
        >
          <View
            style={{
              width: "100%",
              height: widthBorder,
              backgroundColor: variables.colors.grey,
            }}
          />

          <View
            style={{
              width: "100%",
              height: widthCircle / 2 - widthBorder,
              backgroundColor: variables.colors.white,
            }}
          />
        </View>

        <MaskedView
          maskElement={
            <View>
              {/* This is the dot at the end of the filler */}
              {progress > 0 && (
                <View
                  style={{
                    top: widthCircle / 2 - widthFiller / 2,
                    left: widthBorder,
                    width: widthCircle / 2 - widthBorder,
                    height: widthFiller,

                    transform: [{ rotate: `${degreesDot}deg` }],
                    transformOrigin: "right",

                    zIndex: 1,
                    position: "absolute",
                  }}
                >
                  <View
                    style={{
                      width: widthFiller,
                      height: widthFiller,
                      borderRadius: widthFiller,
                      backgroundColor: "black",
                    }}
                  />
                </View>
              )}

              {/* This is the filler */}
              <View
                style={{
                  borderWidth: widthBorder,
                  borderColor: variables.colors.transparent,
                  borderRadius: widthCircle,
                }}
              >
                <View
                  style={{
                    borderLeftColor: variables.colors.transparent,
                    borderTopColor:
                      progress > 0.5
                        ? variables.colors.primary
                        : variables.colors.transparent,

                    borderRightColor:
                      progress > 0.25
                        ? variables.colors.primary
                        : variables.colors.transparent,

                    borderWidth: widthFiller,
                    borderRadius: widthCircle,

                    transform: [{ rotate: `${degreesFiller}deg` }],
                  }}
                >
                  <View
                    style={{
                      width: widthCircle - widthBorder * 2 - widthFiller * 2,
                      height: widthCircle - widthBorder * 2 - widthFiller * 2,
                      borderColor: variables.colors.transparent,
                      borderWidth: widthBorder,
                      borderRadius: widthCircle,
                    }}
                  />
                </View>
              </View>
            </View>
          }
        >
          <View style={{ width: "100%", height: "100%" }}>
            <DecorativeNoise />
            <DecorativeLinear />
          </View>
        </MaskedView>
      </View>
    </View>
  );
}
