// HAPPY

import { View } from "react-native";
import { useState, useEffect, Fragment } from "react";

import TextSmall from "@/components/Text/Small";
import TextTitle from "@/components/Text/Title";
import variables from "@/variables";

import ButtonSmall, { ButtonSmallProps } from "@/components/Button/Small";

type EmptyProps = {
  emoji: string;
  content: string | string[];
  contentSecondary?: string;
  active?: boolean;
  overlay?: boolean;
  button?: ButtonSmallProps;
};

export default function Empty({
  emoji,
  content,
  contentSecondary,
  active = false,
  overlay = false,
  button,
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
    let offset = -variables.gap.normal;

    if (overlay) {
      offset -= variables.heightOverlay / 2;
    }

    if (button) {
      offset -= variables.gap.small;
    }

    return offset;
  };

  return (
    <View
      style={{
        gap: 8,
        flex: 1,
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

      {contentSecondary && (
        <TextSmall
          align="center"
          style={{
            maxWidth: 250,
          }}
        >
          {contentSecondary}
        </TextSmall>
      )}

      {button && (
        <ButtonSmall
          {...button}
          style={{ alignSelf: "center", marginTop: 32 }}
        />
      )}
    </View>
  );
}
