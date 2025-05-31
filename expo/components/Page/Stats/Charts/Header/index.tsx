import TextSmall from "@/components/Text/Small";

import { View } from "react-native";

type PageStatsChartsHeaderProps = {
  title: string;
  titleSecondary?: string;
  options: {
    label: string;
    color: string;
  }[];
};

export default function PageStatsChartsHeader({
  title,
  titleSecondary,
  options,
}: PageStatsChartsHeaderProps) {
  return (
    <View
      style={{
        gap: 8,
        zIndex: 1,
        display: "flex",
        flexWrap: "wrap-reverse",
        flexDirection: "row",
        marginBottom: 16,
      }}
    >
      {titleSecondary ? (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TextSmall
            weight="semibold"
            style={{ width: 36, textAlign: "right" }}
          >
            {title}
          </TextSmall>

          <TextSmall weight="semibold" style={{ width: 18, textAlign: "left" }}>
            {titleSecondary}
          </TextSmall>
        </View>
      ) : (
        <TextSmall weight="semibold" style={{ width: 36, textAlign: "right" }}>
          {title}
        </TextSmall>
      )}

      <View
        style={{
          gap: 16,
          marginLeft: "auto",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        {options.map((option) => (
          <PageStatsChartsHeaderOption
            key={option.label}
            label={option.label}
            color={option.color}
          />
        ))}
      </View>
    </View>
  );
}

type PageStatsChartsHeaderOptionProps = {
  label: string;
  color: string;
};

function PageStatsChartsHeaderOption({
  label,
  color,
}: PageStatsChartsHeaderOptionProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: 16,
          height: 16,
          backgroundColor: color,
          marginRight: 8,
          borderRadius: 16,
        }}
      />
      <TextSmall>{label}</TextSmall>
    </View>
  );
}
