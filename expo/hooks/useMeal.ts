import mealData from "@/queries/mealData";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type UseMealProps = {
  mealId?: string;
  enabled?: boolean;
};

export function useMeal({ mealId, enabled = true }: UseMealProps) {
  const [interval, setInterval] = useState<number | false>(false);

  // Use meal ID query
  const queryMeal = useQuery({
    ...mealData({ uuid: mealId! }),
    select: (meals) => meals[0],
    refetchInterval: interval,
    enabled: enabled && !!mealId,
  });

  const { data: meal, isLoading } = queryMeal;

  // Handle refetch interval based on any product processing state in the meal
  useEffect(() => {
    const processing = meal?.meal_products?.some((x) => x.product.processing);
    const interval = processing ? 500 : false;

    setInterval(interval);
  }, [meal]);

  return {
    meal,
    isLoading,
  };
}
