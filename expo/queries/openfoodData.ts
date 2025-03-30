import { queryOptions } from "@tanstack/react-query";

type openfoodDataType = { barcode: string };

export default function openfoodData({ barcode }: openfoodDataType) {
  return queryOptions({
    queryKey: ["openfoodData", barcode],
    queryFn: async () => {
      const url = `https://swiftbite.app/api/barcode/${barcode}`;
      const response = await fetch(url);
      const ingredients = await response.json();

      return ingredients;
    },
  });
}
