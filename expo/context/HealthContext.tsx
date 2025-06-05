import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import * as Device from "expo-device";

import HealthService from "@/service/HealthService";

// Keys for local storage
const WEIGHT_STORAGE_KEY = "@health_weight";
const CALORIES_STORAGE_KEY = "@health_calories";
const ACTIVE_CALORIES_STORAGE_KEY = "@health_active_calories";

enum HealthStatus {
  Ready = "ready",
  Error = "error",
  Loading = "loading",
  Refreshing = "refreshing",
}

type HealthContextType = {
  weight: number | null;
  active: number | null;
  calories: number | null;

  activeStatus: HealthStatus;
  weightStatus: HealthStatus;
  caloriesStatus: HealthStatus;
};

const HealthContext = createContext<HealthContextType | undefined>(undefined);

type HealthProviderProps = {
  children: ReactNode;
  interval: number;
};

// I've asked Gemini to implement the data caching in this context
export const HealthProvider: React.FC<HealthProviderProps> = ({
  children,
  interval,
}) => {
  const [healthInitialized, setHealthInitialized] = useState(false);
  const [storageInitialized, setStorageInitialized] = useState(false);

  const [weight, setWeight] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);

  const [weightStatus, setWeightStatus] = useState(HealthStatus.Loading);
  const [activeStatus, setActiveStatus] = useState(HealthStatus.Loading);
  const [caloriesStatus, setCaloriesStatus] = useState(HealthStatus.Loading);

  const loadLocal = async () => {
    const weight = await AsyncStorage.getItem(WEIGHT_STORAGE_KEY);
    const active = await AsyncStorage.getItem(ACTIVE_CALORIES_STORAGE_KEY);
    const calories = await AsyncStorage.getItem(CALORIES_STORAGE_KEY);

    if (weight) {
      const weightParsed = parseFloat(weight);

      setWeight(weightParsed);
      setWeightStatus(HealthStatus.Ready);
    }

    if (active) {
      const activeParsed = parseFloat(active);

      setActive(activeParsed);
      setActiveStatus(HealthStatus.Ready);
    }

    if (calories) {
      const caloriesParsed = parseFloat(calories);

      setCalories(caloriesParsed);
      setCaloriesStatus(HealthStatus.Ready);
    }

    return weight !== null && calories !== null && active !== null;
  };

  const fetchData = async (state: HealthStatus) => {
    setWeightStatus(state);
    setCaloriesStatus(state);

    const fetchCalories = async () => {
      const calories = await HealthService.getTotalCalories();

      setCalories(calories);
      setCaloriesStatus(HealthStatus.Ready);

      const stringified = calories.toString();
      await AsyncStorage.setItem(CALORIES_STORAGE_KEY, stringified);
    };

    const fetchActive = async () => {
      const active = await HealthService.getActiveCalories();

      setActive(active);
      setActiveStatus(HealthStatus.Ready);

      const stringified = active.toString();
      await AsyncStorage.setItem(ACTIVE_CALORIES_STORAGE_KEY, stringified);
    };

    const fetchWeight = async () => {
      const weight = await HealthService.getLatestWeight();

      setWeight(weight);
      setWeightStatus(HealthStatus.Ready);

      const stringified = weight.toString();
      await AsyncStorage.setItem(WEIGHT_STORAGE_KEY, stringified);
    };

    await Promise.all([fetchCalories(), fetchWeight(), fetchActive()]);
  };

  useEffect(() => {
    // If we haven't initialized the health service we can't fetch data
    if (!healthInitialized) {
      return;
    }

    // Instantly fetch the data and adjust the state based on the local storage
    const instantState = storageInitialized
      ? HealthStatus.Refreshing
      : HealthStatus.Loading;

    fetchData(instantState);

    // Refresh the data every interval
    const intervalState = HealthStatus.Refreshing;
    const intervalId = setInterval(() => fetchData(intervalState), interval);

    return () => clearInterval(intervalId);
  }, [interval, healthInitialized, storageInitialized]);

  useEffect(() => {
    const initializeHealth = async () => {
      // Load the cache from local storage
      const storageInitialized = await loadLocal();
      setStorageInitialized(storageInitialized);

      // Initialize the health service
      const healthInitialized = await HealthService.initHealthKit();
      setHealthInitialized(healthInitialized);
    };

    if (Device.isDevice) {
      initializeHealth();
    }
  }, []);

  const value: HealthContextType = {
    weight,
    active,
    calories,

    weightStatus,
    activeStatus,
    caloriesStatus,
  };

  return (
    <HealthContext.Provider value={value}>{children}</HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);

  if (context === undefined) {
    throw new Error("useHealth must be used within an HealthProvider");
  }

  return context;
};
