import { Product } from "@/types";
import { handleError } from "@/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import supabase from "@/utils/supabase";

export default function useUpdateProduct() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product): Promise<Product> => {
      const { data, error } = await supabase
        .from("product")
        .update(product)
        .eq("uuid", product.uuid)
        .select()
        .single();

      handleError(error);

      return data;
    },
    onMutate: async (productUpdate) => {
      await query.cancelQueries({ queryKey: ["productData"] });

      const previous = query.getQueryData<Product[]>(["productData"]);
      const updated = previous?.map((product) =>
        product.uuid === productUpdate.uuid ? productUpdate : product,
      );

      query.setQueryData<Product[]>(["productData"], updated);

      return { previous };
    },
    // If the mutation fails, roll back
    onError: (error, variables, context) => {
      query.setQueryData(["productData"], context?.previous);

      console.log(`[Mutation] failed to update product`);
    },
    onSettled: () => {
      query.invalidateQueries({ queryKey: ["productData"] });

      console.log(`[Mutation] updated product`);
    },
  });
}
