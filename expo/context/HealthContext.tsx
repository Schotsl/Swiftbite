import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import HealthService from "../service/HealthService";
import { HealthStatus } from "../types";

interface HealthContextType {
  weight: number | null;
  calories: number | null;
  weightStatus: HealthStatus;
  caloriesStatus: HealthStatus;
}

const HealthContext = createContext<HealthContextType>({
  weight: null,
  calories: null,
  weightStatus: HealthStatus.Loading,
  caloriesStatus: HealthStatus.Loading,
});

export const useHealth = () => useContext(HealthContext);

interface HealthProviderProps {
  children: ReactNode;
  interval: number;
}

export const HealthProvider: React.FC<HealthProviderProps> = ({
  children,
  interval,
}) => {
  const [initialized, setInitialized] = useState(false);

  const [weight, setWeight] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);

  const [weightStatus, setWeightStatus] = useState(HealthStatus.Loading);
  const [caloriesStatus, setCaloriesStatus] = useState(HealthStatus.Loading);

  const fetchData = async (initial = false) => {
    setWeightStatus(initial ? HealthStatus.Refreshing : HealthStatus.Loading);
    setCaloriesStatus(initial ? HealthStatus.Refreshing : HealthStatus.Loading);

    const fetchCalories = async () => {
      const caloriesData = await HealthService.getTotalCalories();

      setCalories(caloriesData);
      setCaloriesStatus(HealthStatus.Ready);
    };

    const fetchWeight = async () => {
      const weightData = await HealthService.getLatestWeight();

      setWeight(weightData);
      setWeightStatus(HealthStatus.Ready);
    };

    await Promise.all([fetchCalories(), fetchWeight()]);
  };

  useEffect(() => {
    if (!initialized) {
      return;
    }

    // Fetch the initial data
    fetchData(true);

    // Refresh the data every interval
    const intervalId = setInterval(() => fetchData(false), interval);

    return () => clearInterval(intervalId);
  }, [interval, initialized]);

  useEffect(() => {
    const initializeHealthKit = async () => {
      // Connect to Apple Health
      await HealthService.initHealthKit();

      // Set the initial state to start fetching data
      setInitialized(true);
    };

    initializeHealthKit();
  }, []);

  const value: HealthContextType = {
    weight,
    calories,
    weightStatus,
    caloriesStatus,
  };

  return (
    <HealthContext.Provider value={value}>{children}</HealthContext.Provider>
  );
};
