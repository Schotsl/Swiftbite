import { queryOptions } from "@tanstack/react-query";

import { IngredientInsert } from "../types";

export default function openfoodData(barcode: string) {
  return queryOptions({
    queryKey: ["openfoodData", barcode],
    queryFn: async () => {
      const url = `http://192.168.2.95:3000/api/openfood?code=${barcode}`;
      const response = await fetch(url);
      const ingredient = await response.json();

      return [ingredient] as IngredientInsert[];
    },
  });
}
