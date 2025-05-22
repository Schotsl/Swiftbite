import Text from "@/components/Text";

import { TextWithoutSizeProps } from "../types";

export default function TextSmall({
  style,
  weight = "normal",
  children,
}: TextWithoutSizeProps) {
  return (
    <Text size={14} weight={weight} style={style}>
      {children}
    </Text>
  );
}
