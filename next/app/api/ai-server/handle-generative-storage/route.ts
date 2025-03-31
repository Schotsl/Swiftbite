import { after } from "next/server";
import { handleError } from "@/helper";
import { fetchTitle, fetchEstimation, fetchSize } from "@/utils/openai";

import { supabase } from "@/utils/supabase";
import { validateUsage } from "@/utils/usage";

export async function POST(request: Request) {
  // Make sure the user isn't over their usage limits
  const body = await request.json();
  const user = body.record.user_id;

  const response = await validateUsage(user);

  if (response) {
    return response;
  }

  const generativeName = body.record.name;
  const generativeUUID = generativeName.push("-small", "");

  after(async () => {
    const signedUrl = await fetchUrl(generativeUUID);

    if (generativeName.endsWith("-small")) {
      // We'll use the small image to figure out the title
      const [title, ingredient] = await Promise.all([
        fetchTitle(user, signedUrl),
        fetchIngredient(generativeUUID),
      ]);

      const { error: ingredientError } = await supabase
        .from("ingredient")
        .update({ title })
        .eq("uuid", ingredient);

      handleError(ingredientError);

      return;
    }

    // First get the ingredient ID
    const ingredient = await fetchIngredient(generativeUUID);

    // Then fetch AI responses and entry data in parallel
    const [estimation, portionSize, entryData] = await Promise.all([
      fetchEstimation(user, signedUrl),
      fetchSize(user, signedUrl),
      fetchEntry(ingredient),
    ]);

    // Update the ingredient with nutritional data
    const { error: ingredientError } = await supabase
      .from("ingredient")
      .update(estimation)
      .eq("uuid", ingredient);

    handleError(ingredientError);

    // If the entry doesn't exist we can't do anything
    if (!entryData) {
      return;
    }

    // Update the entry with the estimated portion size
    const { error: entryUpdateError } = await supabase
      .from("entry")
      .update({
        consumed_unit: "gram",
        consumed_quantity: portionSize,
      })
      .eq("uuid", entryData.uuid);

    handleError(entryUpdateError);

    return;
  });

  return new Response("{}", { status: 200 });
}

const fetchIngredient = async (generativeUUID: string) => {
  const { data, error } = await supabase
    .from("generative")
    .select("ingredient_id")
    .eq("uuid", generativeUUID)
    .single();

  handleError(error);

  return data?.ingredient_id;
};

const fetchEntry = async (ingredientId: string) => {
  const { data, error } = await supabase
    .from("entry")
    .select("uuid")
    .eq("ingredient_id", ingredientId)
    .single();

  handleError(error);

  return data;
};

const fetchUrl = async (generativeUUID: string) => {
  const { data, error } = await supabase.storage
    .from("generative")
    .createSignedUrl(`${generativeUUID}`, 3600);

  handleError(error);

  return data!.signedUrl;
};
