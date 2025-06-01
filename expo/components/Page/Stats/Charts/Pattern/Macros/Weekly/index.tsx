import { View } from "react-native";
import { useMemo } from "react";
import { weekdays } from "../../variables";
import { BarChartPropsType, BarChart } from "react-native-gifted-charts";

import variables from "@/variables";
import language from "@/language";

import PageStatsChartsHeader from "@/components/Page/Stats/Charts/Header";

import {
  height,
  spacing,
  spacingGroup,
  labelWidth,
  labelTextStyle,
  yAxisLabelContainerStyle,
} from "@/components/Page/Stats/Charts/variables";

type PageStatsChartsPatternMacrosWeeklyProps = {
  width: number;
  input: {
    fats: number;
    carbs: number;
    proteins: number;
  }[];
};

export default function PageStatsChartsPatternMacrosWeekly({
  input = [],
  width,
}: PageStatsChartsPatternMacrosWeeklyProps) {
  const data = useMemo(() => {
    const data: BarChartPropsType["stackData"] = [];
    const today = new Date();
    const length = input.length;

    input.forEach(({ fats, carbs, proteins }, index) => {
      const dateObject = new Date(today);
      const dateNumber = today.getDate();
      const dateOffset = length - index;

      dateObject.setDate(dateNumber - dateOffset);

      data.push({
        stacks: [
          {
            value: fats,
            color: variables.macros.fats.background,
          },
          {
            value: proteins,
            color: variables.macros.protein.background,
            marginBottom: spacing,
          },
          {
            value: carbs,
            color: variables.macros.carbs.background,
            marginBottom: spacing,
          },
        ],
        label: weekdays[dateObject.getDay()],
        labelWidth,
        labelTextStyle: {
          ...labelTextStyle,
          transform: [{ translateY: 4 }, { translateX: 6 }],
        },
      });
    });

    return data;
  }, [input]);

  const getWidth = () => {
    const length = data.length;

    const barMargin = spacingGroup * length;
    const barWidth = (width - barMargin) / length;

    return barWidth;
  };

  const getMax = () => {
    const maxSummed = data.map(({ stacks }) =>
      stacks.reduce((sum, { value }) => sum + value, 0),
    );

    const maxValue = Math.max(...maxSummed);
    const maxWithBuffer = Math.ceil(maxValue * 1.15);

    return maxWithBuffer;
  };

  return (
    <View style={{ paddingTop: 16, paddingBottom: 16, overflow: "hidden" }}>
      <PageStatsChartsHeader
        title="gram"
        options={[
          {
            label: language.macros.fats.short,
            color: variables.macros.fats.background,
          },
          {
            label: language.macros.protein.short,
            color: variables.macros.protein.background,
          },
          {
            label: language.macros.carbs.short,
            color: variables.macros.carbs.background,
          },
        ]}
      />

      <BarChart
        color={variables.colors.text.primary}
        height={height}
        spacing={spacingGroup}
        barWidth={getWidth()}
        maxValue={getMax()}
        stackData={data}
        roundedTop
        disablePress
        noOfSections={4}
        disableScroll
        roundedBottom
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisLabelContainerStyle={yAxisLabelContainerStyle}
      />
    </View>
  );
}
