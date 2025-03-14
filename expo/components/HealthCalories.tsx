import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useHealth } from "../context/HealthContext";
import { HealthStatus } from "../types";

export default function HealthCalories() {
  const { calories, caloriesStatus } = useHealth();

  const isLoading = caloriesStatus === HealthStatus.Loading;
  const isRefreshing = caloriesStatus === HealthStatus.Refreshing;

  // Set color based on status
  const textColor = isLoading ? "#8E8E93" : "#FF9500";
  const iconColor = isLoading ? "#8E8E93" : "#FF9500";

  if (caloriesStatus === HealthStatus.Error) {
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons name="fire-alert" size={24} color="#FF5252" />
        <Text style={styles.errorText}>Something went wrong</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Calories</Text>
        {isRefreshing && (
          <ActivityIndicator
            size="small"
            color="#1C1C1E"
            style={styles.loader}
            hidesWhenStopped
          />
        )}
      </View>
      <View style={styles.valueContainer}>
        <MaterialCommunityIcons
          name="fire"
          size={20}
          color={iconColor}
          style={styles.icon}
        />
        <Text style={[styles.valueText, { color: textColor }]}>
          {isLoading ? "Loading..." : `${calories || 0} kcal`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  loader: {
    marginLeft: 2,
    transform: [{ scale: 0.7 }],
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  icon: {
    marginRight: 4,
  },
  valueText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 14,
    color: "#FF5252",
    marginTop: 8,
    textAlign: "center",
  },
});
