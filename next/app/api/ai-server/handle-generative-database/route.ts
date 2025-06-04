import { supabase } from "@/utils/supabase";
import { handleError } from "@/helper";
import { validateUsage } from "@/utils/usage";
import { NextResponse, after } from "next/server";
import { fetchProduct, fetchEntry } from "@/utils/supabase";
import {
  estimateNutrition,
  estimateVisuals,
} from "@/utils/generative/estimate";

export const maxDuration = 120;

export async function POST(request: Request) {
  // Make sure the user isn't over their usage limits
  const body = await request.json();
  const user = body.record.user_id;

  const response = await validateUsage(user);

  if (response) {
    return NextResponse.json({ error: response }, { status: 429 });
  }

  const generativeImage = body.record.image;
  const generativeProduct = body.record.product_id;

  // If the generative content is image based we don't need to do anything
  if (generativeImage) {
    return new Response(null, { status: 204 });
  }

  after(async () => {
    const [productObject, entryObject] = await Promise.all([
      fetchProduct(generativeProduct),
      fetchEntry(generativeProduct),
    ]);

    const image = undefined;
    const title = productObject.title || undefined;
    const content = body.record.content || undefined;

    const data = {
      image,
      title,
      content,
    };

    const [visuals, nutrition] = await Promise.all([
      estimateVisuals(user, data),
      estimateNutrition(user, data),
    ]);

    // If the product already has a title we'll use that
    if (productObject.title) {
      visuals.title = productObject.title;
    }

    const {
      quantity_gram: quantityGram,
      quantity_original: quantityOriginal,
      quantity_original_unit: quantityOriginalUnit,
      serving_gram: servingGram,
      serving_original: servingOriginal,
      serving_original_unit: servingOriginalUnit,
      ...rest
    } = nutrition;

    const quantity =
      quantityGram && quantityOriginalUnit && quantityOriginal
        ? {
            gram: quantityGram,
            option: quantityOriginalUnit,
            quantity: quantityOriginal,
          }
        : null;

    const serving = {
      gram: servingGram,
      option: servingOriginalUnit,
      quantity: servingOriginal,
    };

    // Update the product with nutritional data
    const { error: productError } = await supabase
      .from("product")
      .update({
        ...rest,
        serving,
        quantity,
        processing: false,
      })
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
        serving: {
          gram: serving.gram,
          option: "serving",
          quantity: 1,
        },
      })
      .eq("uuid", entryObject.uuid);

    handleError(entryUpdateError);
  });

  return new Response("{}", { status: 200 });
}
