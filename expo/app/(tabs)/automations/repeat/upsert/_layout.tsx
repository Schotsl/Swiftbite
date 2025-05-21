import repeatData from "@/queries/repeatData";

import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { RepeatProvider } from "@/context/RepeatContext";
import { Slot, useLocalSearchParams } from "expo-router";

import Header from "@/components/Header";
import ProductStatus from "@/components/Product/Status";

export default function AutomationsRepeatUpsertLayout() {
  const { repeat: repeatId } = useLocalSearchParams<{
    repeat: string;
  }>();

  const { data: repeat, isLoading } = useQuery({
    ...repeatData({ uuid: repeatId }),
    select: (data) => data.find((repeat) => repeat.uuid === repeatId),
    enabled: !!repeatId,
  });

  if (isLoading) {
    return <AutomationsRepeatUpsertLayoutLoading />;
  }

  return (
    <RepeatProvider initial={repeat}>
      <Slot />
    </RepeatProvider>
  );
}

function AutomationsRepeatUpsertLayoutLoading() {
  return (
    <View style={{ flex: 1, padding: 32 }}>
      <Header
        title="Herhaling bewerken"
        content="Een herhaling is een product dat automatisch toevoegt wordt op de dagen en tijden die jij kiest"
      />

      <ProductStatus status="We zijn je maaltijd aan het laden uit onze database" />
    </View>
  );
}
