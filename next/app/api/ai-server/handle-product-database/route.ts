import { generateIcon } from "@/utils/generative/generate";
import { validateUsage } from "@/utils/usage";
import { normalizeTitle } from "@/utils/generative/normalize";
import { after, NextResponse } from "next/server";
import {
  fetchIcon,
  insertIcon,
  updateProduct,
  uploadIcon,
} from "@/utils/supabase";

import sharp from "sharp";

export const maxDuration = 120;

export async function POST(request: Request) {
  // Make sure the user isn't over their usage limits
  const body = await request.json();
  const user = body.record.user_id;

  // There are products without a user_id
  if (user) {
    const response = await validateUsage(user);

    if (response) {
      return NextResponse.json({ error: response }, { status: 429 });
    }
  }

  const productIcon = body.record.icon_id;
  const productUuid = body.record.uuid;

  const productTitleNew = body.record.title;
  const productTitleOld = body.old_record?.title;

  // If the product doesn't have a title we can't do anything
  if (!productTitleNew) {
    return new Response("{}", { status: 200 });
  }

  // If the title hasn't changed we don't need to do anything
  if (productTitleOld === productTitleNew) {
    return new Response("{}", { status: 200 });
  }

  // If the product already has an icon we don't need to
  if (productIcon) {
    return new Response("{}", { status: 200 });
  }

  after(async () => {
    // Normalize the title and look it up in the database
    console.log(`[ICON] Normalizing title`);
    const iconTitle = await normalizeTitle(user, { title: productTitleNew });

    console.log(`[ICON] Fetching icon from database`);
    const iconUuid = await fetchIcon(iconTitle);

    // If the icon already exists we'll update the product
    if (iconUuid) {
      console.log(`[ICON] Updating product with icon`);

      await updateProduct(productUuid, iconUuid);

      return;
    }

    try {
      console.log(`[ICON] Inserting icon into database`);
      const iconUuid = await insertIcon(iconTitle);

      console.log(`[ICON] Generating icon`);
      const newIconBuffer = await generateIcon(user, { title: iconTitle });

      console.log(`[ICON] Resizing icon`);
      const newIconResized = await sharp(newIconBuffer).resize(256).toBuffer();

      console.log(`[ICON] Uploading icon to storage`);
      await uploadIcon(`${iconUuid}-256`, newIconResized);
      await updateProduct(productUuid, iconUuid);
      await uploadIcon(`${iconUuid}`, newIconBuffer);
    } catch (error: Error | unknown) {
      // If we get a unique constraint violation try to fetch the icon again
      if (
        error instanceof Error &&
        error.message?.includes("unique constraint")
      ) {
        console.log(`[ICON] Race condition detected, fetching icon again`);
        const iconUuid = await fetchIcon(iconTitle)!;

        console.log(`[ICON] Updating product with existing icon`);
        await updateProduct(productUuid, iconUuid);
      }
      throw error;
    }
  });

  return new Response("{}", { status: 200 });
}
