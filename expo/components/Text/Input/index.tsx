import Text from "@/components/Text";

import { TextWithoutSizeProps } from "../types";

export default function TextInput({
  weight = "semibold",
  ...props
}: TextWithoutSizeProps) {
  return <Text size={22} weight={weight} {...props} />;
}
