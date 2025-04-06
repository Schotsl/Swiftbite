import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleError } from "@/helper";
import { Product } from "@/types";
import supabase from "@/utils/supabase";

export default function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uuid: string): Promise<void> => {
      const { error } = await supabase
        .from("product")
        .delete()
        .eq("uuid", uuid);

      handleError(error);
    },
    onMutate: async (uuid: string) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["productData"] });
      const previousProducts = queryClient.getQueryData<Product[]>([
        "productData",
      ]);

      // Optimistically update the UI by removing the deleted product
      queryClient.setQueryData<Product[]>(["productData"], (old = []) =>
        old.filter((product) => product.uuid !== uuid),
      );

      return { previousProducts };
    },
    // If the mutation fails, roll back to the previous state
    onError: (error, uuid, context) => {
      queryClient.setQueryData(["productData"], context?.previousProducts);

      console.log(`[Mutation] failed to delete product`, error);
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["productData"] });

      console.log(`[Mutation] deleted product`);
    },
  });
}
