import Text from "@/components/Text";

import { TextWithoutSizeProps } from "../types";

export default function TextSmall(props: TextWithoutSizeProps) {
  return <Text size={14} {...props} />;
}
