import { Text, View } from "react-native";
import { useState, useEffect, Fragment } from "react";

type ProductStatusProps = {
  status: string;
  active?: boolean;
};

export default function ProductStatus({
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
        marginTop: -48,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          maxWidth: 250,
          textAlign: "center",

          fontSize: 16,
          fontFamily: "OpenSans_400Regular",
        }}
      >
        {status}

        {active && (
          <Fragment>
            <Text
              style={{
                color: dots > 0 ? "#000" : "transparent",
                fontSize: 16,
                fontFamily: "OpenSans_400Regular",
              }}
            >
              .
            </Text>
            <Text
              style={{
                color: dots > 1 ? "#000" : "transparent",
                fontSize: 16,
                fontFamily: "OpenSans_400Regular",
              }}
            >
              .
            </Text>
            <Text
              style={{
                color: dots > 2 ? "#000" : "transparent",
                fontSize: 16,
                fontFamily: "OpenSans_400Regular",
              }}
            >
              .
            </Text>
          </Fragment>
        )}
      </Text>
    </View>
  );
}
