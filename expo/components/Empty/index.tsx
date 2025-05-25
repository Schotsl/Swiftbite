// HAPPY

import { View } from "react-native";
import { useState, useEffect, Fragment } from "react";

import TextSmall from "@/components/Text/Small";
import TextTitle from "@/components/Text/Title";
import variables from "@/variables";

type EmptyProps = {
  list?: boolean;
  emoji: string;
  content: string;
  overlay?: boolean;
  active?: boolean;
};

export default function Empty({
  list = false,
  emoji,
  content,
  overlay = false,
  active = false,
}: EmptyProps) {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (!active) {
      return;
    }

    const intervalId = setInterval(() => {
      setDots((previous) => {
        const dotIncreased = previous + 1;
        const dotModulo = dotIncreased % 4;

        return dotModulo;
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, [active]);

  const getOffset = () => {
    return overlay
      ? -variables.gap.normal - variables.heightOverlay / 2
      : -variables.gap.normal;
  };

  return (
    <View
      style={{
        gap: 4,
        flex: 1,
        minHeight: list ? "100%" : undefined,
        marginTop: getOffset(),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TextTitle>{emoji}</TextTitle>
      <TextSmall
        align="center"
        weight="medium"
        style={{
          maxWidth: 250,
        }}
      >
        {content}

        {active && (
          <Fragment>
            <TextSmall
              color={dots > 0 ? undefined : variables.colors.transparent}
            >
              .
            </TextSmall>

            <TextSmall
              color={dots > 1 ? undefined : variables.colors.transparent}
            >
              .
            </TextSmall>

            <TextSmall
              color={dots > 2 ? undefined : variables.colors.transparent}
            >
              .
            </TextSmall>
          </Fragment>
        )}
      </TextSmall>
    </View>
  );
}
