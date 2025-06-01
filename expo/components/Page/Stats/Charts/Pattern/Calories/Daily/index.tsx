import { View } from "react-native";
import { useMemo } from "react";
import {
  LineChartPropsType,
  LineChart,
  BarChart,
  BarChartPropsType,
} from "react-native-gifted-charts";

import variables from "@/variables";
import language from "@/language";

import PageStatsChartsHeader from "@/components/Page/Stats/Charts/Header";
import PageStatsChartsBackground from "../../../Background";

import {
  height,
  spacing,
  sections,
  thickness,
  labelWidth,
  labelTextStyle,
  yAxisLabelContainerStyle,
} from "@/components/Page/Stats/Charts/variables";

type PageStatsChartsPatternCaloriesDailyProps = {
  width: number;
  input: number[];
};

export default function PageStatsChartsPatternCaloriesDaily({
  input = [],
  width,
}: PageStatsChartsPatternCaloriesDailyProps) {
  const data = useMemo(() => {
    const date: LineChartPropsType["data"] = [];

    let compound = 50;

    input.forEach((value, index) => {
      const hourString = `${index}:00`;
      const hourLabel = index % 4 === 0 ? hourString : "";

      compound += value;

      date.push({
        value: compound,
        label: hourLabel,
        labelTextStyle: {
          width: labelWidth,
          transform: [{ translateY: 10 }, { translateX: -10 }],

          ...labelTextStyle,
        },
      });
    });

    return date;
  }, [input]);

  const dataBarchart = useMemo(() => {
    const date: BarChartPropsType["data"] = [];

    input.forEach((value) => {
      date.push({ value });
    });

    return date;
  }, [input]);

  const getWidth = () => {
    const length = data.length;

    const barWidth = (width - 8) / length;
    return barWidth;
  };

  const getWidthBarchart = () => {
    const length = input.length;

    const spacingWidth = width - 15;
    const spacingTotal = spacing * (length + 1);
    const spacingValue = (spacingWidth - spacingTotal) / length;

    return spacingValue;
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
        title={language.macros.calories.short}
        options={[
          {
            label: language.macros.calories.long,
            color: variables.macros.protein.background,
          },
        ]}
      />

      <View style={{ position: "relative" }}>
        <LineChart
          data={data}
          color={variables.macros.protein.background}
          width={width}
          curved={true}
          height={height}
          spacing={getWidth()}
          maxValue={getMax()}
          thickness={thickness}
          areaChart={true}
          noOfSections={sections}
          disableScroll={true}
          dataPointsRadius={0}
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisLabelContainerStyle={yAxisLabelContainerStyle}
          endFillColor={variables.macros.protein.background}
          startFillColor={variables.macros.protein.background}
          endOpacity={0.1}
          startOpacity={0.4}
        />
        <PageStatsChartsBackground key="background" />

        <View
          style={{
            top: -1,
            right: 0,
            width: width - 15,
            height: height,
            position: "absolute",
          }}
        >
          <BarChart
            data={dataBarchart}
            width={width}
            height={height}
            spacing={spacing}
            barWidth={getWidthBarchart()}
            maxValue={getMax()}
            disableScroll
            hideRules={true}
            frontColor={variables.macros.carbs.background}
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisLabelWidth={0}
            xAxisLabelsHeight={0}
            yAxisTextStyle={{ color: "transparent" }}
            xAxisLabelTextStyle={{ color: "transparent" }}
          />
        </View>
      </View>
    </View>
  );
}
