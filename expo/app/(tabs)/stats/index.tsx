import variables from "@/variables";
import {
  BarChart,
  BarChartPropsType,
  LineChart,
  LineChartPropsType,
} from "react-native-gifted-charts";
import { LinearGradient, Stop } from "react-native-svg";

import { View, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import PageStatsHeader from "@/components/Page/Stats/Header";
import { transformDate } from "@/helper";
import { useMemo } from "react";
import TextTitle from "@/components/Text/Title";
import TextSubtitle from "@/components/Text/Subtitle";
import TextLarge from "@/components/Text/Large";
import TextSmall from "@/components/Text/Small";

const height = 200;

const spacing = 4;
const spacingGroup = 16;
const rotation = { rotate: "60deg" };

const labelWidth = 45;
const labelTextStyle = {
  color: variables.colors.text.primary,
  fontSize: 10,
};

const yAxisLabelContainerStyle = {
  width: 46,
  backgroundColor: "#ffffff",
  paddingRight: 10,
  justifyContent: "flex-end",
};

export default function Stats() {
  const { width } = useWindowDimensions();
  const chartWidth = width - variables.padding.page * 2 - 36;

  return (
    <ScrollView>
      <View
        style={{
          minHeight: "100%",

          gap: variables.gap.large,
          padding: variables.padding.page,
        }}
      >
        <View style={{ gap: 16 }}>
          <TextSubtitle weight="semibold">Calorieën</TextSubtitle>
          <View style={{ gap: 8 }}>
            <TextLarge weight="semibold">Calorieën In versus Uit</TextLarge>
            <TextSmall>
              Deze grafiek vergelijkt direct hoeveel calorieën je op een dag
              consumeert met hoeveel je er verbrandt
            </TextSmall>
            <CaloriesChart
              width={chartWidth}
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

          <View style={{ gap: 8 }}>
            <TextLarge weight="semibold">Netto calorietrend</TextLarge>
            <TextSmall>
              Deze grafiek toont de ontwikkeling van je dagelijkse
              calorieoverschot of -tekort over een gekozen periode
            </TextSmall>
            <CaloriesBalanceChart
              width={chartWidth}
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
        </View>

        <MacrosChart
          width={chartWidth}
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

        <CaloriesVsWeightChart
          width={chartWidth}
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
    </ScrollView>
  );
}

type CaloriesChartProps = {
  width: number;
  input: {
    consumed: number;
    burned: number;
  }[];
};

function CaloriesChart({ input = [], width }: CaloriesChartProps) {
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
      <PageStatsHeader
        title="kcal"
        options={[
          {
            label: "Calories uit",
            color: variables.macros.protein.background,
          },
          {
            label: "Calories in",
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
        noOfSections={3}
        disableScroll
        roundedBottom
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisLabelContainerStyle={yAxisLabelContainerStyle}
      />
    </View>
  );
}

type CaloriesBalanceChartProps = {
  width: number;
  input: {
    consumed: number;
    burned: number;
  }[];
};

function CaloriesBalanceChart({
  input = [],
  width,
}: CaloriesBalanceChartProps) {
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
      <PageStatsHeader
        title="kcal"
        options={[
          {
            label: "Over",
            color: "green",
          },
          {
            label: "Tekort",
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
        thickness={5}
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

type MacrosChartProps = {
  width: number;
  input: {
    fats: number;
    carbs: number;
    proteins: number;
  }[];
};

function MacrosChart({ input = [], width }: MacrosChartProps) {
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
        label: transformDate(dateObject, true),
        labelWidth,
        labelTextStyle: {
          ...labelTextStyle,
          transform: [{ translateX: -8 }, { translateY: 16 }, rotation],
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
      stacks.reduce((sum, { value }) => sum + value, 0)
    );

    const maxValue = Math.max(...maxSummed);
    const maxWithBuffer = Math.ceil(maxValue * 1.15);

    return maxWithBuffer;
  };

  return (
    <View style={{ overflow: "hidden", paddingBottom: 32 }}>
      <PageStatsHeader
        title="Gram"
        options={[
          {
            label: "Fats",
            color: variables.macros.fats.background,
          },
          {
            label: "Protein",
            color: variables.macros.protein.background,
          },
          {
            label: "Carbs",
            color: variables.macros.carbs.background,
          },
        ]}
      />

      <BarChart
        color={variables.colors.text.primary}
        height={200}
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

type CaloriesVsWeightChartProps = {
  width: number;
  input: {
    calories: number;
    weight: number;
  }[];
};

function CaloriesVsWeightChart({
  input = [],
  width,
}: CaloriesVsWeightChartProps) {
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

    const trimmed = width - 36;

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
    <View style={{ overflow: "hidden", paddingBottom: 32 }}>
      <PageStatsHeader
        title="Calories"
        titleSecondary="Weight"
        options={[
          {
            label: "Calories (kcal)",
            color: "orange",
          },
          {
            label: "Weight (kg)",
            color: "purple",
          },
        ]}
      />

      <BarChart
        data={data}
        color={variables.colors.text.primary}
        width={width - 36}
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
