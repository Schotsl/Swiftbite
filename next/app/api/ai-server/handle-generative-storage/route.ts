import { after } from "next/server";
import { handleError } from "@/helper";
import { estimateVisuals, estimateNutrition } from "@/utils/openai";

import { supabase } from "@/utils/supabase";
import { validateUsage } from "@/utils/usage";

export async function POST(request: Request) {
  // Make sure the user isn't over their usage limits
  const body = await request.json();
  const user = body.record.owner_id;

  const response = await validateUsage(user);

  if (response) {
    return response;
  }

  const generativeName = body.record.name;
  const generativeUUID = generativeName.replace("-small", "");

  after(async () => {
    const signedUrl = await fetchUrl(generativeUUID);

    if (generativeName.endsWith("-small")) {
      // We'll use the small image to figure out the title
      const [visuals, product] = await Promise.all([
        estimateVisuals(user, signedUrl),
        fetchProduct(generativeUUID),
      ]);

      const { error: productError } = await supabase
        .from("product")
        .update(visuals)
        .eq("uuid", product);

      handleError(productError);

      return;
    }

    // First get the product ID
    const product = await fetchProduct(generativeUUID);

    // Then fetch AI responses and entry data in parallel
    const [nutrition, entry] = await Promise.all([
      estimateNutrition(user, signedUrl),
      fetchEntry(product),
    ]);

    // Update the product with nutritional data
    const { error: productError } = await supabase
      .from("product")
      .update(nutrition)
      .eq("uuid", product);

    handleError(productError);

    // If the entry doesn't exist we can't do anything
    if (!entry) {
      return;
    }

    // Update the entry with the estimated serving size
    const { error: entryUpdateError } = await supabase
      .from("entry")
      .update({
        consumed_unit: nutrition.serving_unit,
        consumed_quantity: nutrition.serving,
      })
      .eq("uuid", entry.uuid);

    handleError(entryUpdateError);

    return;
  });

  return new Response("{}", { status: 200 });
}

const fetchProduct = async (generativeUUID: string) => {
  const { data, error } = await supabase
    .from("generative")
    .select("product_id")
    .eq("uuid", generativeUUID)
    .single();

  handleError(error);

  return data?.product_id;
};

const fetchEntry = async (productId: string) => {
  const { data, error } = await supabase
    .from("entry")
    .select("uuid")
    .eq("product_id", productId)
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
