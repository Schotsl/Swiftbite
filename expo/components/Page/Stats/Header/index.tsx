import TextSmall from "@/components/Text/Small";
import { View } from "react-native";

type PageStatsHeaderProps = {
  title: string;
  titleSecondary?: string;
  options: {
    label: string;
    color: string;
  }[];
};

export default function PageStatsHeader({
  title,
  titleSecondary,
  options,
}: PageStatsHeaderProps) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap-reverse",
        gap: 16,
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
          <TextSmall weight="semibold">{title}</TextSmall>
          <TextSmall weight="semibold">{titleSecondary}</TextSmall>
        </View>
      ) : (
        <TextSmall weight="semibold">{title}</TextSmall>
      )}

      <View
        style={{
          marginLeft: "auto",
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
        }}
      >
        {options.map((option) => (
          <PageStatsHeaderOption
            key={option.label}
            label={option.label}
            color={option.color}
          />
        ))}
      </View>
    </View>
  );
}

type PageStatsHeaderOptionProps = {
  label: string;
  color: string;
};

function PageStatsHeaderOption({ label, color }: PageStatsHeaderOptionProps) {
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
