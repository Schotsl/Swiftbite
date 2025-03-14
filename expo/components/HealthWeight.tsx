import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import HealthService from "@/service/HealthService";
import { HealthStatus } from "@/types";

export default function HealthWeight() {
  const [status, setStatus] = useState<HealthStatus>(HealthStatus.Loading);
  const [weight, setWeight] = useState<number | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchWeight = async () => {
      if (Platform.OS !== "ios") {
        setStatus(HealthStatus.Error);
        return;
      }

      await HealthService.initHealthKit();

      intervalRef.current = setInterval(async () => {
        try {
          const weight = await HealthService.getLatestWeight();
          setWeight(weight);
          setStatus(HealthStatus.Ready);
        } catch (error) {
          console.error("Error fetching weight:", error);
          setStatus(HealthStatus.Error);
        }
      }, 10000);
    };

    fetchWeight();

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
        {status === HealthStatus.Loading ? (
          <Text style={styles.loading}>Loading...</Text>
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
