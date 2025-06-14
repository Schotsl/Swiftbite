import { supabase } from "@/utils/supabase";
import { handleError } from "@/helper";
import { validateUsage } from "@/utils/usage";
import { NextResponse, after } from "next/server";
import {
  estimateNutrition,
  estimateVisuals,
} from "@/utils/generative/estimate";

import {
  fetchUrl,
  fetchEntry,
  fetchProduct,
  fetchGenerative,
} from "@/utils/supabase";

export const maxDuration = 120;

export async function POST(request: Request) {
  const body = await request.json();
  const bucket = body.record.bucket_id;

  // Make sure it's the right bucket /generative
  if (bucket !== "generative") {
    return new Response(null, { status: 204 });
  }

  // Make sure the user isn't over their usage limits
  const user = body.record.owner_id;
  const response = await validateUsage(user);

  if (response) {
    return NextResponse.json({ error: response }, { status: 429 });
  }

  const generativeName = body.record.name;
  const generativeUUID = generativeName.replace("-small", "");

  after(async () => {
    // TODO: This could be joined or ran in parallel
    const generativeObject = await fetchGenerative(generativeUUID);
    const productObject = await fetchProduct(generativeObject.product_id);

    // If the generative object doesn't have an image we can't do anything
    if (!generativeObject.image) {
      return;
    }

    const image = await fetchUrl(generativeUUID);

    const { title } = productObject;
    const { content } = generativeObject;

    const data = {
      image: image || undefined,
      title: title || undefined,
      content: content || undefined,
    };

    if (generativeName.endsWith("-small")) {
      // We'll use the small image to figure out the title
      const visuals = await estimateVisuals(user, data);

      // If the product already has a title we'll use that
      if (productObject.title) {
        visuals.title = productObject.title;
      }

      const { error: productError } = await supabase
        .from("product")
        .update(visuals)
        .eq("uuid", productObject.uuid);

      handleError(productError);

      return;
    }

    // Then fetch AI responses and entry data in parallel
    const [nutrition, entry] = await Promise.all([
      estimateNutrition(user, data),
      fetchEntry(productObject.uuid),
    ]);

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
      .eq("uuid", entry.uuid);

    handleError(entryUpdateError);

    return;
  });

  return new Response("{}", { status: 200 });
}
