import { User } from "@/types/user";
import { handleError } from "@/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import supabase from "@/utils/supabase";

export default function useUpdateUser() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (user: User): Promise<User> => {
      const { email, total, ...rest } = user;
      const { data, error } = await supabase
        .from("user")
        .update(rest)
        .eq("uuid", user.uuid)
        .select()
        .single();

      handleError(error);

      return data;
    },
    onMutate: async (userUpdate) => {
      await query.cancelQueries({ queryKey: ["userData"] });
      const previous = query.getQueryData<User>(["userData"]);

      query.setQueryData<User>(["userData"], userUpdate);

      return { previous };
    },
    // If the mutation fails, roll back
    onError: (error, variables, context) => {
      query.setQueryData(["userData"], context?.previous);

      console.log(`[Mutation] failed to update user`);
    },
    onSettled: () => {
      query.invalidateQueries({ queryKey: ["userData"] });

      console.log(`[Mutation] updated user`);
    },
  });
}
