import { useMemo } from "react";
import { getToday } from "@/helper";
import { useSuspenseQuery } from "@tanstack/react-query";

import entryData from "../queries/entryData";

export default function useDailyMacros() {
  const { startDate, endDate } = getToday();

  const { data: entries } = useSuspenseQuery({
    ...entryData({}),
    select: (entries) => {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      return entries.filter((entry) => {
        const entryTime = new Date(entry.created_at).getTime();
        return entryTime >= start && entryTime <= end;
      });
    },
  });

  const totals = useMemo(() => {
    let fats = 0;
    let carbs = 0;
    let protein = 0;
    let calories = 0;

    entries.forEach((entry) => {
      if (entry.product && entry.consumed_gram) {
        const multiplier = entry.consumed_gram / 100;

        fats += (entry.product.fat_100g || 0) * multiplier;
        carbs += (entry.product.carbohydrate_100g || 0) * multiplier;
        protein += (entry.product.protein_100g || 0) * multiplier;
        calories += (entry.product.calorie_100g || 0) * multiplier;
      }
    });

    return {
      fats: Math.round(fats),
      carbs: Math.round(carbs),
      protein: Math.round(protein),
      calories: Math.round(calories),
    };
  }, [entries]);

  return totals;
}
