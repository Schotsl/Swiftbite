import { queryOptions } from "@tanstack/react-query";

import { Ingredient } from "../types";

export default function openfoodData(barcode: string) {
  return queryOptions({
    queryKey: ["openfoodData", barcode],
    queryFn: async () => {
      const url = `https://swiftbite.app/api/openfood?code=${barcode}`;
      const response = await fetch(url);
      const ingredient = await response.json();

      return ingredient as Ingredient;
    },
  });
}
