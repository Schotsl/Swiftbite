import Text from "@/components/Text";

import { TextWithoutSizeProps } from "../types";

export default function TextSubtitle(props: TextWithoutSizeProps) {
  return <Text size={22} {...props} />;
}
