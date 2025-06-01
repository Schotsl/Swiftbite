import { View } from "react-native";
import { useMemo } from "react";
import { transformDate } from "@/helper";
import { LinearGradient, Stop } from "react-native-svg";
import { LineChartPropsType, LineChart } from "react-native-gifted-charts";

import variables from "@/variables";

import PageStatsChartsHeader from "@/components/Page/Stats/Charts/Header";

import {
  height,
  rotation,
  labelTextStyle,
  yAxisLabelContainerStyle,
  thickness,
} from "@/components/Page/Stats/Charts/variables";

import language from "@/language";

type PageStatsChartsHistoryBalanceProps = {
  width: number;
  input: {
    consumed: number;
    burned: number;
  }[];
};

export default function PageStatsChartsHistoryBalance({
  input = [],
  width,
}: PageStatsChartsHistoryBalanceProps) {
  const data = useMemo(() => {
    const data: LineChartPropsType["data"] = [];
    const today = new Date();
    const length = input.length;

    input.forEach(({ consumed, burned }, index) => {
      const dateObject = new Date(today);
      const dateNumber = today.getDate();
      const dateOffset = length - index;

      dateObject.setDate(dateNumber - dateOffset);

      data.push({
        value: consumed - burned,
        label: transformDate(dateObject, true),
        labelTextStyle: {
          ...labelTextStyle,
          transform: [{ translateY: 113 }, rotation],
        },
      });
    });

    return data;
  }, [input]);

  const getWidth = () => {
    const length = data.length;

    const widthAdjusted = width + 10;
    const widthDivided = widthAdjusted / length;

    return widthDivided;
  };

  const getMax = () => {
    const maxValues = data.map((item) => Math.abs(item.value || 0));
    const maxValue = Math.max(...maxValues);
    const maxWithBuffer = Math.ceil(maxValue * 2);

    return maxWithBuffer;
  };

  return (
    <View style={{ paddingTop: 16, paddingBottom: 32, overflow: "hidden" }}>
      <PageStatsChartsHeader
        title={language.macros.calories.short}
        options={[
          {
            label: language.page.stats.charts.history.calories.balance.surplus,
            color: "green",
          },
          {
            label: language.page.stats.charts.history.calories.balance.deficit,
            color: "red",
          },
        ]}
      />

      <LineChart
        data={data}
        color={variables.colors.text.primary}
        curved
        height={height / 2}
        spacing={getWidth()}
        maxValue={getMax()}
        thickness={thickness}
        xAxisColor={variables.colors.greyDark}
        noOfSections={2}
        disableScroll
        dataPointsColor={variables.colors.text.primary}
        mostNegativeValue={-getMax()}
        yAxisThickness={0}
        yAxisLabelContainerStyle={yAxisLabelContainerStyle}
        lineGradient
        lineGradientId="balanceLineGradient"
        lineGradientComponent={() => {
          return (
            <LinearGradient
              id="balanceLineGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <Stop offset="0%" stopColor="green" />
              <Stop offset="20%" stopColor="green" />
              <Stop offset="80%" stopColor="red" />
              <Stop offset="100%" stopColor="red" />
            </LinearGradient>
          );
        }}
      />
    </View>
  );
}
