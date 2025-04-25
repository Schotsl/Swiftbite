import { normalizeTitle, generateIcon } from "@/utils/openai";
import { validateUsage } from "@/utils/usage";
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

  const response = await validateUsage(user);

  if (response) {
    return NextResponse.json({ error: response }, { status: 429 });
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

    console.log(`[ICON] Generating icon`);
    const newIconBuffer = await generateIcon({ title: iconTitle });

    console.log(`[ICON] Inserting icon into database`);
    const newIconUuid = await insertIcon(iconTitle);

    console.log(`[ICON] Resizing icon`);
    const newIconResized = await sharp(newIconBuffer).resize(256).toBuffer();

    console.log(`[ICON] Uploading icon to storage`);
    await uploadIcon(`${newIconUuid}-256`, newIconResized);
    await updateProduct(productUuid, newIconUuid);
    await uploadIcon(`${newIconUuid}`, newIconBuffer);
  });

  return new Response("{}", { status: 200 });
}
