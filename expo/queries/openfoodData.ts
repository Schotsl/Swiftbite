import { queryOptions } from "@tanstack/react-query";

type openfoodDataType = { barcode: string };

export default function openfoodData({ barcode }: openfoodDataType) {
  return queryOptions({
    queryKey: ["openfoodData", barcode],
    queryFn: async () => {
      const url = `${process.env.EXPO_PUBLIC_SWIFTBITE_URL}/api/barcode?code=${barcode}&lang=en`;
      const response = await fetch(url);
      const products = await response.json();

      return products;
    },
  });
}
