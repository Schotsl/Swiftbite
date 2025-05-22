// HAPPY

import { View } from "react-native";
import { transformDate } from "@/helper";
import { getDateRelative } from "./helper";

import TextSmall from "@/components/Text/Small";
import TextTitle from "@/components/Text/Subtitle";

type HeaderTitleProps = {
  date: Date;
};

export default function HeaderTitle({ date }: HeaderTitleProps) {
  const labelDate = transformDate(date);
  const labelRelative = getDateRelative(date);

  return (
    <View>
      <TextTitle weight="semibold">{labelDate}</TextTitle>
      <TextSmall>{labelRelative}</TextSmall>
    </View>
  );
}
