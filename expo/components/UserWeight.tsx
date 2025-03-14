import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import HealthService from "@/service/HealthService";
import { HealthStatus } from "@/types";

export default function UserWeight() {
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
      <MaterialCommunityIcons name="scale-bathroom" size={24} color="#007AFF" />
      <Text style={styles.title}>Current Weight</Text>
      {status === HealthStatus.Loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <Text style={styles.weight}>
          {weight ? `${weight.toFixed(1)} kg` : "No data"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
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
  weight: {
    fontSize: 28,
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
