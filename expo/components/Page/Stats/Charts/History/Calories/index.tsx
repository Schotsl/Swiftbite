import { View } from "react-native";
import { useMemo } from "react";
import { transformDate } from "@/helper";
import { BarChartPropsType, BarChart } from "react-native-gifted-charts";

import variables from "@/variables";
import language from "@/language";

import PageStatsChartsHeader from "@/components/Page/Stats/Charts/Header";

import {
  height,
  rotation,
  sections,
  spacing,
  spacingGroup,
  labelWidth,
  labelTextStyle,
  yAxisLabelContainerStyle,
} from "@/components/Page/Stats/Charts/variables";

type PageStatsChartsHistoryCaloriesProps = {
  width: number;
  input: {
    consumed: number;
    burned: number;
  }[];
};

export default function PageStatsChartsHistoryCalories({
  input = [],
  width,
}: PageStatsChartsHistoryCaloriesProps) {
  const data = useMemo(() => {
    const data: BarChartPropsType["data"] = [];
    const today = new Date();
    const length = input.length;

    input.forEach(({ consumed, burned }, index) => {
      const dateObject = new Date(today);
      const dateNumber = today.getDate();
      const dateOffset = length - index;

      dateObject.setDate(dateNumber - dateOffset);

      data.push({
        value: consumed,
        spacing,
        label: transformDate(dateObject, true),
        labelWidth,
        labelTextStyle: {
          ...labelTextStyle,
          transform: [{ translateY: 14 }, { translateX: -12 }, rotation],
        },
        frontColor: variables.macros.protein.background,
      });

      data.push({
        value: burned,
        frontColor: variables.macros.carbs.background,
      });
    });

    return data;
  }, [input]);

  const getWidth = () => {
    const length = data.length;
    const lengthGroup = length / 2;

    const totalSpacing = spacing * lengthGroup;
    const totalSpacingGroup = spacingGroup * lengthGroup;

    const barWidth = (width - totalSpacing - totalSpacingGroup) / length;
    return barWidth;
  };

  const getMax = () => {
    const maxValues = data.map((item) => item.value || 0);
    const maxValue = Math.max(...maxValues);
    const maxWithBuffer = Math.ceil(maxValue * 1.15);

    return maxWithBuffer;
  };

  return (
    <View style={{ paddingTop: 16, paddingBottom: 32, overflow: "hidden" }}>
      <PageStatsChartsHeader
        title={language.macros.calories.short}
        options={[
          {
            label: language.page.stats.charts.history.calories.calories.out,
            color: variables.macros.protein.background,
          },
          {
            label: language.page.stats.charts.history.calories.calories.in,
            color: variables.macros.carbs.background,
          },
        ]}
      />

      <BarChart
        data={data}
        color={variables.colors.text.primary}
        height={height}
        spacing={spacingGroup}
        barWidth={getWidth()}
        maxValue={getMax()}
        roundedTop
        disablePress
        noOfSections={sections}
        disableScroll
        roundedBottom
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisLabelContainerStyle={yAxisLabelContainerStyle}
      />
    </View>
  );
}
