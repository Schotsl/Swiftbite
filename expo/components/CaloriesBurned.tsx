import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import HealthService from "@/service/HealthService";
import { HealthStatus } from "@/types";

export default function CaloriesBurned() {
  const [status, setStatus] = useState<HealthStatus>(HealthStatus.Loading);
  const [calories, setCalories] = useState<number | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initializeHealthKit = async () => {
      if (Platform.OS !== "ios") {
        setStatus(HealthStatus.Error);
        return;
      }

      await HealthService.initHealthKit();

      intervalRef.current = setInterval(async () => {
        const calories = await HealthService.getTotalCalories();

        setCalories(calories);
        setStatus(HealthStatus.Ready);
      }, 10000);
    };

    initializeHealthKit();

    return () => {
      if (!intervalRef.current) {
        return;
      }

      clearInterval(intervalRef.current);

      intervalRef.current = null;
    };
  }, []);

  if (status === HealthStatus.Error) {
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons name="fire-alert" size={24} color="#FF5252" />
        <Text style={styles.errorText}>Something went wrong</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="fire" size={24} color="#FF9500" />
      <Text style={styles.title}>Calories Burned Today</Text>
      {status === HealthStatus.Loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <Text style={styles.calories}>{calories || 0} kcal</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
    color: "#1C1C1E",
  },
  calories: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF9500",
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
