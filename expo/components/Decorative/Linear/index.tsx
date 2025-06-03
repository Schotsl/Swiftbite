import React, { useState, useRef, useCallback } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { useWindowDimensions, View } from "react-native";

import type { NativeLinearGradientPoint } from "expo-linear-gradient";

import variables from "@/variables";

// I've asked Gemini to write a Gradient that is global for a nicer gradient so although I did refactor it it's not my work
export default function DecorativeLinear() {
  const { width: windowWidth } = useWindowDimensions();

  const wrapper = useRef<View>(null);
  const colors = [
    variables.colors.primary,
    variables.colors.primaryGradient,
  ] as const;

  const [colorsCalculated, setColorsCalculated] = useState<null | {
    start: NativeLinearGradientPoint;
    end: NativeLinearGradientPoint;
  }>(null);

  const measureComponent = useCallback(() => {
    if (!wrapper.current) {
      return;
    }

    wrapper.current.measure((x, y, width, height, pageX, pageY) => {
      if (width <= 0 || height <= 0) {
        return;
      }

      if (windowWidth <= 0) {
        return;
      }

      const componentXStart = pageX / windowWidth;
      const componentXEnd = (pageX + width) / windowWidth;
      const componentXDiff = componentXEnd - componentXStart;

      if (componentXDiff <= 0) {
        return;
      }

      const globalStartX = 0;
      const globalEndX = 1;

      const localStartX = (globalStartX - componentXStart) / componentXDiff;
      const localEndX = (globalEndX - componentXStart) / componentXDiff;

      setColorsCalculated({
        end: [localEndX, 0],
        start: [localStartX, 0],
      });
    });
  }, [windowWidth]);

  return (
    <View
      ref={wrapper}
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        position: "absolute",
      }}
      onLayout={measureComponent}
    >
      {colorsCalculated && (
        <LinearGradient
          end={colorsCalculated.end}
          start={colorsCalculated.start}
          colors={colors}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </View>
  );
}
