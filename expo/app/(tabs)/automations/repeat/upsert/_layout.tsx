import repeatData from "@/queries/repeatData";

import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ScrollView } from "react-native-gesture-handler";
import { RepeatProvider } from "@/context/RepeatContext";
import { useLocalSearchParams, Stack } from "expo-router";

import Empty from "@/components/Empty";
import Header from "@/components/Header";
import ButtonOverlay from "@/components/Button/Overlay";

import language from "@/language";
import variables from "@/variables";

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
      <Stack
        screenOptions={{
          animation: "none",
          headerShown: false,
          gestureEnabled: true,
          contentStyle: {
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="camera" />

        <Stack.Screen name="meal/index" />
        <Stack.Screen name="search/index" />
        <Stack.Screen name="product/index" />
      </Stack>
    </RepeatProvider>
  );
}

function AutomationsRepeatUpsertLayoutLoading() {
  return (
    <View>
      <ScrollView style={{ minHeight: "100%" }}>
        <View
          style={{
            minHeight: "100%",

            gap: variables.gap.large,
            padding: variables.padding.page,
            paddingBottom: variables.paddingOverlay,
          }}
        >
          <Header
            title={language.modifications.getEdit(language.types.repeat.single)}
            content={language.types.repeat.explanation}
          />

          <Empty
            emoji="🔎"
            active={true}
            overlay={true}
            content={language.types.repeat.loading}
          />
        </View>
      </ScrollView>

      <ButtonOverlay
        title={language.modifications.getSave(language.types.repeat.single)}
        loading={true}
        disabled={true}
        onPress={() => {}}
      />
    </View>
  );
}
