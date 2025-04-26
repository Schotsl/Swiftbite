import { getMacrosFromMeal, getMacrosFromProduct, getRange } from "@/helper";
import { useSuspenseQuery } from "@tanstack/react-query";

import entryData from "../queries/entryData";
import { useMemo } from "react";

export default function useDailyMacros() {
  const { startDate, endDate } = getRange();

  const { data: entries } = useSuspenseQuery({
    ...entryData({}),
    select: (entries) => {
      const end = new Date(endDate).getTime();
      const start = new Date(startDate).getTime();

      return entries.filter((entry) => {
        const entryDate = new Date(entry.created_at);
        const entryTime = entryDate.getTime();

        return entryTime >= start && entryTime <= end;
      });
    },
  });

  const totals = useMemo(() => {
    const macros = entries.map((entry) => {
      const { product, meal } = entry;

      if (product) {
        const serving = {
          gram: entry.consumed_gram!,
          option: entry.consumed_option!,
          quantity: entry.consumed_quantity!,
        };

        return getMacrosFromProduct(product, serving);
      }

      if (meal) {
        return getMacrosFromMeal(meal);
      }

      return {
        fat: 0,
        gram: 0,
        carbs: 0,
        protein: 0,
        calories: 0,
      };
    });

    return macros.reduce(
      (acc, macro) => {
        return {
          fat: acc.fat + macro.fat,
          gram: acc.gram + macro.gram,
          carbs: acc.carbs + macro.carbs,
          protein: acc.protein + macro.protein,
          calories: acc.calories + macro.calories,
        };
      },
      { fat: 0, gram: 0, carbs: 0, protein: 0, calories: 0 },
    );
  }, [entries]);

  return totals;
}
