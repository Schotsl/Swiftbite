import repeatData from "@/queries/repeatData";

import { useQuery } from "@tanstack/react-query";
import { RepeatProvider } from "@/context/RepeatContext";
import { Slot, useLocalSearchParams } from "expo-router";

export default function AutomationsRepeatUpsertLayout() {
  const { repeat: repeatId } = useLocalSearchParams<{
    repeat: string;
  }>();

  const { data: repeat } = useQuery({
    ...repeatData(),
    select: (data) => data.find((repeat) => repeat.uuid === repeatId),
    enabled: !!repeatId,
  });

  return (
    <RepeatProvider initial={repeat}>
      <Slot />
    </RepeatProvider>
  );
}
