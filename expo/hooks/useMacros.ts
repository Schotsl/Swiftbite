import entryData from "../queries/entryData";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Macro } from "@/types";
import { getMacrosFromMeal, getMacrosFromProduct } from "@/helper";

export default function useMacros(date: Date): Macro {
  const { data: entries } = useQuery(entryData({ date }));

  const totals = useMemo(() => {
    if (!entries) {
      return { fat: 0, gram: 0, carbs: 0, protein: 0, calories: 0 };
    }

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
      { fat: 0, gram: 0, carbs: 0, protein: 0, calories: 0 },
    );
  }, [entries]);

  return totals;
}
