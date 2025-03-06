import { handleError } from "@/helper";
import { generateIcon } from "@/utils/icon";
import { normalizeTitle } from "@/utils/openai";
import { after } from "next/server";

import supabase from "@/utils/supabase";

export const maxDuration = 120;

export async function POST(request: Request) {
  const body = await request.json();

  const ingredientIcon = body.record.icon_id;
  const ingredientUuid = body.record.uuid;
  const ingredientTitle = body.record.title;

  console.log(body);

  // If the title hasn't yet been or the icon already exists we'll skip
  if (!ingredientTitle || ingredientIcon) {
    return new Response("{}", { status: 200 });
  }

  after(async () => {
    // Normalize the title and look it up in the database
    console.log(`[ICON] Normalizing title`);
    const iconTitle = await normalizeTitle(ingredientTitle);
    const iconUuid = await fetchIcon(iconTitle);

    // If the icon already exists we'll update the ingredient
    if (iconUuid) {
      await updateIngredient(ingredientUuid, iconUuid);

      return new Response("{}", { status: 200 });
    }

    const insertUuid = await insertIcon(iconTitle);

    await generateIcon(insertUuid, iconTitle);
    await updateIngredient(ingredientUuid, insertUuid);
  });

  return new Response("{}", { status: 200 });
}

const updateIngredient = async (ingredient: string, icon: string) => {
  console.log(`[ICON] Updating ingredient with icon`);

  const { error } = await supabase
    .from("ingredient")
    .update({ icon_id: icon })
    .eq("uuid", ingredient);

  handleError(error);
};

const fetchIcon = async (title: string) => {
  console.log(`[ICON] Fetching icon from database`);

  const { error, data } = await supabase
    .from("icon")
    .select("uuid")
    .eq("title", title);

  handleError(error);

  // We can't use single since it will throw an error if the data is empty
  const icons = data || [];
  return icons[0]?.uuid;
};

const insertIcon = async (title: string) => {
  console.log(`[ICON] Inserting icon into database`);

  const { error, data } = await supabase
    .from("icon")
    .insert({
      title,
    })
    .select("uuid")
    .single();

  handleError(error);

  return data!.uuid as string;
};
