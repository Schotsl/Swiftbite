import { Control } from "react-hook-form";
import { useState } from "react";
import { StatsData } from "@/schemas/stats";
import { useWindowDimensions, View } from "react-native";

import TextSmall from "@/components/Text/Small";
import TextLarge from "@/components/Text/Large";
import TextBody from "@/components/Text/Body";
import TextTitle from "@/components/Text/Title";

import PageStatsChartsHistoryCalories from "./Calories";
import PageStatsChartsHistoryBalance from "./Balance";
import PageStatsChartsHistoryMacros from "./Macros";
import PageStatsChartsHistoryWeight from "./Weight";
import PageStatsSection from "@/components/Page/Stats/Section";

import InputRange from "@/components/Input/Range";
import ButtonSmall from "@/components/Button/Small";

import variables from "@/variables";
import language from "@/language";

type PageStatsChartsHistoryProps = {
  control: Control<StatsData>;
};

export default function PageStatsChartsHistory({
  control,
}: PageStatsChartsHistoryProps) {
  const [open, setOpen] = useState<string | null>("calories");

  const [apple, setApple] = useState(true);

  const { width: widthWindow } = useWindowDimensions();

  // TODO: Why is this 36, I feel like it should be 32 as that is the page padding
  const width = widthWindow - variables.padding.page * 2 - 36;

  const handleToggle = (value: string) => {
    setOpen((prev) => (prev === value ? null : value));
  };

  return (
    <View style={{ gap: 32 }}>
      <TextTitle>{language.page.stats.charts.history.title}</TextTitle>
      <InputRange
        name="date"
        label={language.input.range.title}
        control={control}
      />

      <View style={{ gap: 24 }}>
        <PageStatsSection
          open={open === "calories"}
          title={language.macros.calories.long}
          onToggle={() => handleToggle("calories")}
        >
          <View style={{ gap: 8 }}>
            <View style={{ position: "relative" }}>
              <View style={{ opacity: apple ? 0.04 : 1, gap: 8 }}>
                <TextLarge weight="semibold">
                  {language.page.stats.charts.history.calories.calories.title}
                </TextLarge>
                <TextSmall>
                  {language.page.stats.charts.history.calories.calories.content}
                </TextSmall>

                <PageStatsChartsHistoryCalories
                  width={width}
                  input={[
                    { consumed: 2300, burned: 2500 },
                    { consumed: 3100, burned: 3000 },
                    { consumed: 2700, burned: 2800 },
                    { consumed: 3000, burned: 3200 },
                    { consumed: 2800, burned: 2700 },
                    { consumed: 3000, burned: 2900 },
                    { consumed: 2900, burned: 3100 },
                  ]}
                />
              </View>

              {apple && (
                <PageStatsChartsHistoryOverlay
                  onPress={() => setApple(false)}
                />
              )}
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <TextLarge weight="semibold">
              {language.page.stats.charts.history.calories.balance.title}
            </TextLarge>
            <TextSmall>
              {language.page.stats.charts.history.calories.balance.content}
            </TextSmall>

            <PageStatsChartsHistoryBalance
              width={width}
              input={[
                { consumed: 2300, burned: 2500 },
                { consumed: 3100, burned: 3000 },
                { consumed: 2700, burned: 2800 },
                { consumed: 3000, burned: 3200 },
                { consumed: 2800, burned: 2700 },
                { consumed: 3000, burned: 2900 },
                { consumed: 2900, burned: 3100 },
              ]}
            />
          </View>
        </PageStatsSection>

        <PageStatsSection
          title={language.page.stats.charts.history.macros.title}
          open={open === "macros"}
          onToggle={() => handleToggle("macros")}
        >
          <View style={{ gap: 8 }}>
            <TextLarge weight="semibold">
              {language.page.stats.charts.history.macros.macros.title}
            </TextLarge>
            <TextSmall>
              {language.page.stats.charts.history.macros.macros.content}
            </TextSmall>

            <PageStatsChartsHistoryMacros
              width={width}
              input={[
                { fats: 70, proteins: 150, carbs: 300 },
                { fats: 75, proteins: 160, carbs: 320 },
                { fats: 65, proteins: 155, carbs: 310 },
                { fats: 80, proteins: 165, carbs: 330 },
                { fats: 70, proteins: 150, carbs: 290 },
                { fats: 72, proteins: 158, carbs: 315 },
                { fats: 68, proteins: 162, carbs: 325 },
              ]}
            />
          </View>
        </PageStatsSection>

        <PageStatsSection
          last={true}
          open={open === "weight"}
          title={language.page.personal.health.input.weight}
          onToggle={() => handleToggle("weight")}
        >
          <View style={{ gap: 8 }}>
            <View style={{ position: "relative" }}>
              <View style={{ opacity: apple ? 0.04 : 1, gap: 8 }}>
                <TextLarge weight="semibold">
                  {language.page.stats.charts.history.weight.weight.title}
                </TextLarge>
                <TextSmall>
                  {language.page.stats.charts.history.weight.weight.content}
                </TextSmall>

                <PageStatsChartsHistoryWeight
                  width={width}
                  input={[
                    { calories: 2200, weight: 70.5 },
                    { calories: 2350, weight: 70.3 },
                    { calories: 2100, weight: 70.4 },
                    { calories: 2400, weight: 70.1 },
                    { calories: 2250, weight: 70.2 },
                    { calories: 2300, weight: 70.0 },
                    { calories: 2150, weight: 69.9 },
                  ]}
                />
              </View>

              {apple && (
                <PageStatsChartsHistoryOverlay
                  onPress={() => setApple(false)}
                />
              )}
            </View>
          </View>
        </PageStatsSection>
      </View>
    </View>
  );
}

type PageStatsChartsHistoryOverlayProps = {
  onPress: () => void;
};

function PageStatsChartsHistoryOverlay({
  onPress,
}: PageStatsChartsHistoryOverlayProps) {
  return (
    <View
      style={{
        gap: 24,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TextBody weight="semibold" align="center" style={{ marginTop: -16 }}>
        Stel de Apple-integratie in en we importeren je gewicht. Zo kunnen we
        uitgebreidere grafieken tonen en feedback geven op je caloriebudget.
      </TextBody>
      <ButtonSmall
        icon="apple"
        title="Apple-integratie instellen"
        style={{
          marginLeft: "auto",
          marginRight: "auto",
        }}
        onPress={onPress}
      />
    </View>
  );
}
