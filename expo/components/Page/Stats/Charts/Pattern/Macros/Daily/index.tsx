import { View } from "react-native";
import { useMemo } from "react";
import { LineChartPropsType, LineChart } from "react-native-gifted-charts";

import language from "@/language";
import variables from "@/variables";

import PageStatsChartsHeader from "@/components/Page/Stats/Charts/Header";
import PageStatsChartsBackground from "@/components/Page/Stats/Charts/Background";

import {
  height,
  sections,
  thickness,
  labelWidth,
  labelTextStyle,
  yAxisLabelContainerStyle,
} from "@/components/Page/Stats/Charts/variables";

type PageStatsChartsPatternMacrosDailyProps = {
  width: number;
  input: {
    fats: number;
    carbs: number;
    proteins: number;
  }[];
};

export default function PageStatsChartsPatternMacrosDaily({
  input = [],
  width,
}: PageStatsChartsPatternMacrosDailyProps) {
  const { dataFats, dataCarbs, dataProteins } = useMemo(() => {
    const dataFats: LineChartPropsType["data"] = [];
    const dataCarbs: LineChartPropsType["data2"] = [];
    const dataProteins: LineChartPropsType["data3"] = [];

    let compoundFats = 0;
    let compoundCarbs = 0;
    let compoundProteins = 0;

    input.forEach(({ fats, carbs, proteins }, index) => {
      const hourString = `${index}:00`;
      const hourLabel = index % 4 === 0 ? hourString : "";

      compoundFats += fats;
      compoundCarbs += carbs;
      compoundProteins += proteins;

      dataFats.push({
        value: compoundFats,
        label: hourLabel,
        labelTextStyle: {
          width: labelWidth,
          transform: [{ translateY: 10 }, { translateX: -10 }],
          ...labelTextStyle,
        },
      });
      dataCarbs.push({ value: compoundCarbs });
      dataProteins.push({ value: compoundProteins });
    });

    return {
      dataFats,
      dataCarbs,
      dataProteins,
    };
  }, [input]);

  const getWidth = () => {
    const length = dataFats.length;

    const spacingWidth = width - 8;
    const spacingDivided = spacingWidth / length;

    return spacingDivided;
  };

  const getMax = () => {
    const fatValues = dataFats.map((item) => item.value || 0);
    const carbsValues = dataCarbs.map((item) => item.value || 0);
    const proteinsValues = dataProteins.map((item) => item.value || 0);

    const fatMax = Math.max(0, ...fatValues);
    const carbsMax = Math.max(0, ...carbsValues);
    const proteinsMax = Math.max(0, ...proteinsValues);

    const maxValue = Math.max(fatMax, carbsMax, proteinsMax);
    const maxWithBuffer = Math.ceil(maxValue * 1.15);

    return maxWithBuffer === 0 ? 10 : maxWithBuffer;
  };

  return (
    <View style={{ paddingTop: 16, paddingBottom: 16, overflow: "hidden" }}>
      <PageStatsChartsHeader
        title={language.measurement.units.gram.long}
        options={[
          {
            label: language.macros.fats.short,
            color: variables.macros.fats.background,
          },
          {
            label: language.macros.carbs.short,
            color: variables.macros.carbs.background,
          },
          {
            label: language.macros.protein.short,
            color: variables.macros.protein.background,
          },
        ]}
      />

      <View style={{ position: "relative" }}>
        <LineChart
          data={dataFats}
          data2={dataCarbs}
          data3={dataProteins}
          color={variables.macros.fats.background}
          color2={variables.macros.carbs.background}
          color3={variables.macros.protein.background}
          zIndex1={3}
          zIndex2={2}
          zIndex3={1}
          areaChart={true}
          startFillColor={variables.macros.fats.background}
          endFillColor={variables.macros.fats.background}
          startOpacity={0.4}
          endOpacity={0.1}
          areaChart2={true}
          startFillColor2={variables.macros.carbs.background}
          endFillColor2={variables.macros.carbs.background}
          startOpacity2={0.4}
          endOpacity2={0.1}
          areaChart3={true}
          startFillColor3={variables.macros.protein.background}
          endFillColor3={variables.macros.protein.background}
          startOpacity3={0.4}
          endOpacity3={0.1}
          width={width}
          height={height}
          curved={true}
          spacing={getWidth()}
          maxValue={getMax()}
          thickness={thickness}
          noOfSections={sections}
          disableScroll={true}
          dataPointsRadius={0}
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisLabelContainerStyle={yAxisLabelContainerStyle}
        />

        <PageStatsChartsBackground />
      </View>
    </View>
  );
}
