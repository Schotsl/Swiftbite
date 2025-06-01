import { Control } from "react-hook-form";
import { useState } from "react";
import { StatsData } from "@/schemas/stats";
import { useWindowDimensions, View } from "react-native";

import TextTitle from "@/components/Text/Title";
import TextSmall from "@/components/Text/Small";
import TextLarge from "@/components/Text/Large";

import PageStatsSection from "@/components/Page/Stats/Section";
import PageStatsChartsPatternMacrosWeekly from "./Macros/Weekly";
import PageStatsChartsPatternMacrosDaily from "./Macros/Daily";
import PageStatsChartsPatternCaloriesDaily from "./Calories/Daily";
import PageStatsChartsPatternCaloriesWeekly from "./Calories/Weekly";

import InputRange from "@/components/Input/Range";

import variables from "@/variables";

type PageStatsChartsPatternProps = {
  control: Control<StatsData>;
};

export default function PageStatsChartsPattern({
  control,
}: PageStatsChartsPatternProps) {
  const [open, setOpen] = useState<string | null>("calories");

  const { width: widthWindow } = useWindowDimensions();

  const width = widthWindow - variables.padding.page * 2 - 36;

  const handleToggle = (value: string) => {
    setOpen((prev) => (prev === value ? null : value));
  };

  return (
    <View style={{ gap: 32 }}>
      <TextTitle>Patronen</TextTitle>

      <View style={{ gap: 24 }}>
        <PageStatsSection
          open={open === "calories"}
          title="Calorieën"
          onToggle={() => handleToggle("calories")}
        >
          <View style={{ gap: 8 }}>
            <TextLarge weight="semibold">Wekelijkse calorieën</TextLarge>
            <TextSmall>
              Deze grafiek toont uw gemiddelde calorie-inname per weekdag
            </TextSmall>

            <PageStatsChartsPatternCaloriesWeekly
              width={width}
              input={[2300, 3100, 2700, 3000, 2800, 3000, 2900]}
            />
          </View>

          <View style={{ gap: 8 }}>
            <TextLarge weight="semibold">Dagelijkse calorieën</TextLarge>
            <TextSmall>
              Deze grafiek toont uw gemiddelde calorie-inname verspreid over de
              dagG
            </TextSmall>

            <PageStatsChartsPatternCaloriesDaily
              width={width}
              input={[
                0, 0, 0, 0, 0, 0, 0, 0, 300, 100, 50, 50, 500, 100, 50, 200, 50,
                50, 600, 100, 50, 150, 50, 1000,
              ]}
            />
          </View>
        </PageStatsSection>

        <PageStatsSection
          open={open === "macros"}
          title="Macronutriënten"
          onToggle={() => handleToggle("macros")}
        >
          <View style={{ gap: 8 }}>
            <TextLarge weight="semibold">Wekelijkse macronutriënten</TextLarge>
            <TextSmall>
              Deze grafiek toont uw gemiddelde macronutriënten-inname per
              weekdag
            </TextSmall>

            <PageStatsChartsPatternMacrosWeekly
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

          <View style={{ gap: 8 }}>
            <TextLarge weight="semibold">Dagelijkse macronutriënten</TextLarge>
            <TextSmall>
              Deze grafiek toont uw gemiddelde macronutriënten-inname verspreid
              over de dag
            </TextSmall>

            <PageStatsChartsPatternMacrosDaily
              width={width}
              input={[
                { fats: 0, proteins: 0, carbs: 0 },
                { fats: 0, proteins: 0, carbs: 0 },
                { fats: 0, proteins: 0, carbs: 0 },
                { fats: 0, proteins: 0, carbs: 0 },
                { fats: 0, proteins: 0, carbs: 0 },
                { fats: 0, proteins: 0, carbs: 0 },
                { fats: 1, proteins: 3, carbs: 5 },
                { fats: 10, proteins: 25, carbs: 40 },
                { fats: 5, proteins: 15, carbs: 30 },
                { fats: 1, proteins: 3, carbs: 5 },
                { fats: 5, proteins: 10, carbs: 20 },
                { fats: 1, proteins: 2, carbs: 5 },
                { fats: 15, proteins: 30, carbs: 50 },
                { fats: 10, proteins: 25, carbs: 40 },
                { fats: 1, proteins: 3, carbs: 5 },
                { fats: 5, proteins: 10, carbs: 20 },
                { fats: 1, proteins: 2, carbs: 5 },
                { fats: 2, proteins: 5, carbs: 10 },
                { fats: 15, proteins: 30, carbs: 50 },
                { fats: 10, proteins: 20, carbs: 40 },
                { fats: 1, proteins: 2, carbs: 5 },
                { fats: 3, proteins: 5, carbs: 10 },
                { fats: 1, proteins: 1, carbs: 2 },
                { fats: 0, proteins: 0, carbs: 0 },
              ]}
            />
          </View>
        </PageStatsSection>

        <InputRange name="date" label="Datum range" control={control} />
      </View>
    </View>
  );
}
