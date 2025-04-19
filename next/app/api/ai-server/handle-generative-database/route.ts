import { handleError } from "@/helper";
import { estimateNutrition, estimateVisuals } from "@/utils/openai";
import { after } from "next/server";

import { fetchGenerative, supabase } from "@/utils/supabase";
import { validateUsage } from "@/utils/usage";
import { fetchEntry, fetchProduct } from "@/utils/supabase";

export const maxDuration = 120;

export async function POST(request: Request) {
  // Make sure the user isn't over their usage limits
  const body = await request.json();
  const user = body.record.user_id;

  const response = await validateUsage(user);

  if (response) {
    return response;
  }

  const generativeImage = body.record.image;
  const generativeProduct = body.record.product_id;

  // If the generative content is image based we don't need to do anything
  if (generativeImage) {
    return new Response("{}", { status: 200 });
  }

  after(async () => {
    const [productObject, entryObject] = await Promise.all([
      fetchProduct(generativeProduct),
      fetchEntry(generativeProduct),
    ]);

    const title = productObject.title;
    const content = body.record.content;

    const data = { title, content, image: null };

    const [visuals, nutrition] = await Promise.all([
      estimateVisuals(user, data),
      estimateNutrition(user, data),
    ]);

    // If the product already has a title we'll use that
    if (productObject.title) {
      visuals.title = productObject.title;
    }

    // Update the product with nutritional data
    const { error: productError } = await supabase
      .from("product")
      .update(nutrition)
      .eq("uuid", productObject.uuid);

    handleError(productError);

    // If the entry doesn't exist we can't do anything
    if (!entryObject) {
      return;
    }

    // Update the entry with the estimated serving size
    const { error: entryUpdateError } = await supabase
      .from("entry")
      .update({
        consumed_unit: nutrition.serving_unit,
        consumed_quantity: nutrition.serving,
      })
      .eq("uuid", entryObject.uuid);

    handleError(entryUpdateError);
  });

  return new Response("{}", { status: 200 });
}
