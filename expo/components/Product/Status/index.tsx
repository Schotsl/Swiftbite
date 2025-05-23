import { View } from "react-native";
import { useState, useEffect, Fragment } from "react";

import TextBody from "@/components/Text/Body";

type ProductStatusProps = {
  small?: boolean;
  status: string;
  active?: boolean;
};

export default function ProductStatus({
  small = false,
  status,
  active = true,
}: ProductStatusProps) {
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

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TextBody
        align="center"
        style={{
          maxWidth: 250,
          marginTop: small ? -12 : -48,
        }}
      >
        {status}

        {active && (
          <Fragment>
            <TextBody color={dots > 0 ? undefined : "transparent"}>.</TextBody>
            <TextBody color={dots > 1 ? undefined : "transparent"}>.</TextBody>
            <TextBody color={dots > 2 ? undefined : "transparent"}>.</TextBody>
          </Fragment>
        )}
      </TextBody>
    </View>
  );
}
