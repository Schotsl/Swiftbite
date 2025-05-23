import Text from "@/components/Text";

import { TextWithoutSizeProps } from "../types";

export default function TextLarge(props: TextWithoutSizeProps) {
  return <Text size={18} {...props} />;
}
