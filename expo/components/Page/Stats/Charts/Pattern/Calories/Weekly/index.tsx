import { View } from "react-native";
import { useMemo } from "react";
import { BarChartPropsType, BarChart } from "react-native-gifted-charts";

import variables from "@/variables";
import language from "@/language";

import PageStatsChartsHeader from "@/components/Page/Stats/Charts/Header";

import {
  height,
  sections,
  spacingGroup,
  labelWidth,
  labelTextStyle,
  yAxisLabelContainerStyle,
} from "@/components/Page/Stats/Charts/variables";
import { weekdays } from "../../variables";

type PageStatsChartsPatternCaloriesWeeklyProps = {
  width: number;
  input: number[];
};

export default function PageStatsChartsPatternCaloriesWeekly({
  input = [],
  width,
}: PageStatsChartsPatternCaloriesWeeklyProps) {
  const data = useMemo(() => {
    const date: BarChartPropsType["data"] = [];
    const today = new Date();
    const length = input.length;

    input.forEach((value, index) => {
      const dateObject = new Date(today);
      const dateNumber = today.getDate();
      const dateOffset = length - index;

      dateObject.setDate(dateNumber - dateOffset);

      const dayIndex = dateObject.getDay();
      const dayString = weekdays[dayIndex];

      date.push({
        value: value,
        label: dayString,
        labelWidth,
        labelTextStyle: {
          ...labelTextStyle,
          transform: [{ translateY: 10 }, { translateX: -10 }],
        },
      });
    });

    return date;
  }, [input]);

  const getBarWidth = () => {
    const length = data.length;
    const barMargin = spacingGroup * length;
    const barWidth = (width - barMargin) / length;

    return barWidth;
  };

  const getMax = () => {
    const maxValues = data.map((item) => item.value || 0);
    const maxValue = Math.max(0, ...maxValues);
    const maxWithBuffer = Math.ceil(maxValue * 1.15);

    return maxWithBuffer === 0 ? 10 : maxWithBuffer;
  };

  return (
    <View style={{ paddingTop: 16, paddingBottom: 16, overflow: "hidden" }}>
      <PageStatsChartsHeader
        title="kcal"
        options={[
          {
            label: language.macros.calories.long,
            color: variables.macros.protein.background,
          },
        ]}
      />

      <BarChart
        data={data}
        color={variables.colors.text.primary}
        height={height}
        spacing={spacingGroup}
        barWidth={getBarWidth()}
        maxValue={getMax()}
        frontColor={variables.macros.protein.background}
        roundedTop={true}
        disablePress={true}
        noOfSections={sections}
        disableScroll={true}
        roundedBottom={true}
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisLabelContainerStyle={yAxisLabelContainerStyle}
      />
    </View>
  );
}
