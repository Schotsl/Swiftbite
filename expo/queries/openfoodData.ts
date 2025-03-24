import { queryOptions } from "@tanstack/react-query";

type openfoodDataType = { barcode: string };

export default function openfoodData({ barcode }: openfoodDataType) {
  return queryOptions({
    queryKey: ["openfoodData", barcode],
    queryFn: async () => {
      const url = `http://192.168.2.95:3000/api/openfood?code=${barcode}`;
      const response = await fetch(url);
      const ingredients = await response.json();

      return ingredients;
    },
  });
}
