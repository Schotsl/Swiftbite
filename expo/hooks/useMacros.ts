import entryData from "../queries/entryData";

import { useMemo } from "react";
import { EntryWithMeal, EntryWithProduct, MacroAbsolute } from "@/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getMacrosFromMeal, getMacrosFromProduct, getRange } from "@/helper";

export default function useDailyMacros(): MacroAbsolute {
  const { startDate, endDate } = getRange();

  const { data: entries } = useSuspenseQuery({
    ...entryData<EntryWithProduct | EntryWithMeal>({}),
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
      const { product, meal, serving } = entry;

      if (!serving) {
        return {
          fat: 0,
          gram: 0,
          carbs: 0,
          protein: 0,
          calories: 0,
        };
      }

      if (product) {
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
      { fat: 0, gram: 0, carbs: 0, protein: 0, calories: 0 }
    );
  }, [entries]);

  return totals;
}
