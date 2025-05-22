import Text from "@/components/Text";

import { TextWithoutSizeProps } from "../types";

export default function TextBody({
  style,
  weight = "normal",
  children,
}: TextWithoutSizeProps) {
  return (
    <Text size={16} weight={weight} style={style}>
      {children}
    </Text>
  );
}
