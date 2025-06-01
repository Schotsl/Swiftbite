import { View } from "react-native";
import { useMemo } from "react";
import { transformDate } from "@/helper";
import { BarChartPropsType, BarChart } from "react-native-gifted-charts";

import variables from "@/variables";

import PageStatsChartsHeader from "@/components/Page/Stats/Charts/Header";

import {
  rotation,
  spacing,
  spacingGroup,
  labelWidth,
  labelTextStyle,
  yAxisLabelContainerStyle,
} from "@/components/Page/Stats/Charts/variables";
import language from "@/language";

type PageStatsChartsHistoryWeightProps = {
  width: number;
  input: {
    calories: number;
    weight: number;
  }[];
};

export default function PageStatsChartsHistoryWeight({
  input = [],
  width,
}: PageStatsChartsHistoryWeightProps) {
  const data = useMemo(() => {
    const data: BarChartPropsType["data"] = [];
    const today = new Date();
    const length = input.length;

    input.forEach(({ calories, weight }, index) => {
      const dateObject = new Date(today);
      const dateNumber = today.getDate();
      const dateOffset = length - index;

      dateObject.setDate(dateNumber - dateOffset);

      data.push({
        value: calories,
        label: transformDate(dateObject, true),
        labelWidth,
        labelTextStyle: {
          ...labelTextStyle,
          transform: [{ translateX: -14 }, { translateY: 14 }, rotation],
        },
        frontColor: "orange",
        spacing,
      });

      data.push({
        value: weight,
        frontColor: "purple",
        isSecondary: true,
      });
    });

    return data;
  }, [input]);

  const getWidth = () => {
    const length = data.length;
    const lengthGroup = length / 2;

    const trimmed = width - 33;

    const totalSpacing = spacing * lengthGroup;
    const totalSpacingGroup = spacingGroup * lengthGroup;

    const barWidth = (trimmed - totalSpacing - totalSpacingGroup) / length;
    return barWidth;
  };

  const getCaloriesMax = () => {
    const maxCalories = data.filter((item) => !item.isSecondary);
    const maxValues = maxCalories.map((item) => item.value || 0);
    const maxValue = Math.max(...maxValues);
    const maxWithBuffer = Math.ceil(maxValue * 1.15);

    return maxWithBuffer;
  };

  const getWeightMax = () => {
    const maxWeight = data.filter((item) => item.isSecondary);
    const maxValues = maxWeight.map((item) => item.value || 0);
    const maxValue = Math.max(...maxValues);
    const maxWithBuffer = Math.ceil(maxValue * 1.15);

    return maxWithBuffer;
  };

  return (
    <View style={{ paddingTop: 16, paddingBottom: 32, overflow: "hidden" }}>
      <PageStatsChartsHeader
        title={language.macros.calories.short}
        titleSecondary="kg"
        options={[
          {
            label: language.macros.calories.long,
            color: "orange",
          },
          {
            label: language.page.personal.health.input.weight,
            color: "purple",
          },
        ]}
      />

      <BarChart
        data={data}
        color={variables.colors.text.primary}
        width={width - 18 - 15}
        height={200}
        spacing={spacingGroup}
        barWidth={getWidth()}
        maxValue={getCaloriesMax()}
        roundedTop
        disablePress={true}
        noOfSections={4}
        disableScroll={true}
        secondaryYAxis={{
          maxValue: getWeightMax(),
          yAxisLabelContainerStyle: {
            ...yAxisLabelContainerStyle,
            width: 18,
            paddingRight: 0,
          },
        }}
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisLabelContainerStyle={yAxisLabelContainerStyle}
      />
    </View>
  );
}
