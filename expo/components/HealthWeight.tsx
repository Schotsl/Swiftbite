import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useHealth } from "../context/HealthContext";
import { HealthStatus } from "../types";

export default function HealthWeight() {
  const { weight, weightStatus } = useHealth();

  if (weightStatus === HealthStatus.Error) {
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="scale-bathroom"
          size={24}
          color="#FF5252"
        />
        <Text style={styles.errorText}>Could not fetch weight data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight</Text>
      <View style={styles.valueContainer}>
        <MaterialCommunityIcons
          name="scale-bathroom"
          size={20}
          color="#007AFF"
          style={styles.icon}
        />
        {weightStatus === HealthStatus.Loading ||
        weightStatus === HealthStatus.Refreshing ? (
          <Text style={styles.loading}>
            {weightStatus === HealthStatus.Refreshing && weight
              ? `${(weight / 1000).toFixed(1)} kg`
              : "Loading..."}
          </Text>
        ) : (
          <Text style={styles.weight}>
            {weight ? `${(weight / 1000).toFixed(1)} kg` : "No data"}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    margin: 8,
    flex: 1,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1C1C1E",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  icon: {
    marginRight: 4,
  },
  weight: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  loading: {
    fontSize: 16,
    color: "#8E8E93",
  },
  errorText: {
    fontSize: 14,
    color: "#FF5252",
    marginTop: 8,
    textAlign: "center",
  },
});
