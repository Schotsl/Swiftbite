import Text from "@/components/Text";

import { TextWithoutSizeProps } from "../types";

export default function TextBody(props: TextWithoutSizeProps) {
  return <Text size={16} {...props} />;
}
