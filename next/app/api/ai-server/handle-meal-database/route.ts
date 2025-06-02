import { handleError } from "@/helper";
import { generateIcon } from "@/utils/generative/generate";
import { normalizeMeal } from "@/utils/generative/normalize";
import { validateUsage } from "@/utils/usage";
import { NextResponse, after } from "next/server";
import {
  fetchIcon,
  fetchIngredients,
  insertIcon,
  supabase,
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
  const titleOld = body.old_record?.title;

  // If the title and the ingredients haven't changed we don't need to do anything
  if (title === titleOld) {
    return new Response("{}", { status: 200 });
  }

  after(async () => {
    await Promise.all([
      updateMealIcon(user, { uuid, title }),
      updateMealDependencies({ uuid }),
    ]);
  });

  return new Response("{}", { status: 200 });
}

const updateMealIcon = async (
  user: string,
  { uuid, title }: { uuid: string; title: string }
) => {
  // First we'll reset the icon to null so it shows the loading icon again
  console.log(`[MEAL] Resetting icon`);
  await updateMeal(uuid, null);

  // Normalize the title and look it up in the database
  console.log(`[MEAL] Normalizing title`);

  const ingredientsObjects = await fetchIngredients(uuid);
  const ingredients = ingredientsObjects.map(
    (ingredient) => ingredient.product.title
  );

  const iconTitle = await normalizeMeal(user, {
    title,
    ingredients,
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
  const newIconBuffer = await generateIcon(user, { title: iconTitle });

  console.log(`[MEAL] Inserting icon into database`);
  const newIconUuid = await insertIcon(iconTitle);

  console.log(`[MEAL] Resizing icon`);
  const newIconResized = await sharp(newIconBuffer).resize(256).toBuffer();

  console.log(`[ICON] Uploading icon to storage`);
  await uploadIcon(`${newIconUuid}-256`, newIconResized);
  await updateMeal(uuid, newIconUuid);
  await uploadIcon(`${newIconUuid}`, newIconBuffer);
};

const updateMealDependencies = async ({ uuid }: { uuid: string }) => {
  const ingredientsObjects = await fetchIngredients(uuid);
  const ingredientsGrams = ingredientsObjects.reduce((acc, ingredient) => {
    return acc + ingredient.serving.gram;
  }, 0);

  // Update every entry with this meal_id to update the serving
  const promiseEntry = supabase
    .from("entry")
    .update({
      serving: { gram: ingredientsGrams, option: "quantity", quantity: 1 },
    })
    .eq("meal_id", uuid);

  // Update every repeat with this meal_id to update the serving
  const promiseRepeat = supabase
    .from("entry")
    .update({
      serving: { gram: ingredientsGrams, option: "quantity", quantity: 1 },
    })
    .eq("meal_id", uuid);

  const [{ error: errorEntry }, { error: errorRepeat }] = await Promise.all([
    promiseEntry,
    promiseRepeat,
  ]);

  handleError(errorEntry);
  handleError(errorRepeat);
};
