import React from "react";
import { Text, View } from "react-native";

type TableRow = {
  id: string | number;
  label: string;
  value: string | number;
};

type TableProps = {
  data: TableRow[];
  title?: string;
  subtitle?: string;
};

export default function Table({ data, title, subtitle }: TableProps) {
  return (
    <View style={{ marginBottom: 20 }}>
      {title && (
        <Text
          style={{
            color: "#000",
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 12,
          }}
        >
          {title}
        </Text>
      )}

      {subtitle && (
        <Text
          style={{
            color: "#666",
            fontSize: 14,
            fontStyle: "italic",
            marginBottom: 12,
          }}
        >
          {subtitle}
        </Text>
      )}

      <View
        style={{
          borderWidth: 1,
          borderColor: "#eee",
        }}
      >
        {data.map((row) => (
          <View
            key={row.id}
            style={{
              padding: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: data[data.length - 1].id !== row.id ? 1 : 0,
              borderBottomColor: "#eee",
              backgroundColor: "#fff",
            }}
          >
            <Text style={{ fontSize: 16, color: "#000" }}>{row.label}</Text>
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#000" }}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
