import Text from "@/components/Text";

import { TextWithoutSizeProps } from "../types";

export default function TextTitle({
  weight = "semibold",
  ...props
}: TextWithoutSizeProps) {
  return <Text size={28} weight={weight} {...props} />;
}
