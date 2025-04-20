import { Text, View } from "react-native";
import { useState, useEffect } from "react";

type ProductStatusProps = {
  status: string;
};

export default function ProductStatus({ status }: ProductStatusProps) {
  const [visibleDots, setVisibleDots] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setVisibleDots((previous) => {
        const dotIncreased = previous + 1;
        const dotModulo = dotIncreased % 4;

        return dotModulo;
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

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

        <Text
          style={{
            color: visibleDots > 0 ? "#000" : "transparent",
            fontSize: 16,
            fontFamily: "OpenSans_400Regular",
          }}
        >
          .
        </Text>
        <Text
          style={{
            color: visibleDots > 1 ? "#000" : "transparent",
            fontSize: 16,
            fontFamily: "OpenSans_400Regular",
          }}
        >
          .
        </Text>
        <Text
          style={{
            color: visibleDots > 2 ? "#000" : "transparent",
            fontSize: 16,
            fontFamily: "OpenSans_400Regular",
          }}
        >
          .
        </Text>
      </Text>
    </View>
  );
}
