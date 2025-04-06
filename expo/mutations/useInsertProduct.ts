import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";

import { handleError } from "@/helper";
import { Product, ProductInsert } from "@/types";
import supabase from "@/utils/supabase";

export default function useInsertProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ProductInsert): Promise<Product> => {
      const { data, error } = await supabase
        .from("product")
        .insert(product)
        .select()
        .single();

      handleError(error);

      return data;
    },
    onMutate: async (productInsert: ProductInsert) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["productData"] });

      const product = {
        ...productInsert,
        uuid: Crypto.randomUUID(),
        updated_at: null,
        created_at: new Date().toISOString(),
      } as Product;

      queryClient.setQueryData<Product[]>(["productData"], (old = []) => [
        product,
        ...old,
      ]);

      const previous = queryClient.getQueryData(["productData"]);
      return { previous };
    },
    // If the mutation fails, roll back
    onError: (error, variables, context) => {
      queryClient.setQueryData(["productData"], context?.previous);

      console.log(`[Mutation] failed to insert product`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["productData"] });

      console.log(`[Mutation] inserted product`);
    },
  });
}
