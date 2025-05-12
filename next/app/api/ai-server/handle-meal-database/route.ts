import { generateIcon, normalizeMeal } from "@/utils/openai";
import { validateUsage } from "@/utils/usage";
import { after, NextResponse } from "next/server";
import {
  fetchIcon,
  fetchIngredients,
  insertIcon,
  updateMeal,
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

  const uuid = body.record.uuid;
  const title = body.record.title;

  after(async () => {
    // Normalize the title and look it up in the database
    console.log(`[MEAL] Normalizing title`);
    const iconIngredients = await fetchIngredients(uuid);
    const iconTitle = await normalizeMeal(user, {
      title: title,
      ingredients: iconIngredients,
    });

    console.log(`[MEAL] Fetching icon from database`);
    const iconUuid = await fetchIcon(iconTitle);

    // If the icon already exists we'll update the product
    if (iconUuid) {
      console.log(`[MEAL] Updating meal with icon`);
      await updateMeal(uuid, iconUuid);

      return;
    }

    console.log(`[MEAL] Generating icon`);
    const newIconBuffer = await generateIcon({ title: iconTitle });

    console.log(`[MEAL] Inserting icon into database`);
    const newIconUuid = await insertIcon(iconTitle);

    console.log(`[MEAL] Resizing icon`);
    const newIconResized = await sharp(newIconBuffer).resize(256).toBuffer();

    console.log(`[ICON] Uploading icon to storage`);
    await uploadIcon(`${newIconUuid}-256`, newIconResized);
    await updateMeal(uuid, newIconUuid);
    await uploadIcon(`${newIconUuid}`, newIconBuffer);
  });

  return new Response("{}", { status: 200 });
}
