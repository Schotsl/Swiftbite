import { handleError } from "@/helper";
import { removeBackground } from "@/utils/background";
import { generateIcon, normalizeTitle } from "@/utils/openai";
import supabase from "@/utils/supabase";
import { after } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  return new Response("{}", { status: 200 });

  const ingredientUuid = body.record.uuid;
  const ingredientTitle = body.record.title;

  // If the title hasn't yet been generated we'll skip
  if (!ingredientTitle) {
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

    const imagePipeline = async () => {
      console.log(`[ICON] Generating icon using AI`);
      const base64 = await generateIcon(iconTitle);

      console.log(`[ICON] Removing background from icon`);
      const blob = await removeBackground(base64);

      return blob;
    };

    const databasePipeline = async () => {
      const insertUuid = await insertIcon(iconTitle);

      return insertUuid;
    };

    // We'll run both pipelines in parallel
    const [blob, uuid] = await Promise.all([
      imagePipeline(),
      databasePipeline(),
    ]);

    // We'll upload the icon and update the ingredient
    await uploadIcon(uuid, blob);
    await updateIngredient(ingredientUuid, uuid);
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

const uploadIcon = async (uuid: string, blob: Blob) => {
  console.log(`[ICON] Uploading icon`);

  const { error } = await supabase.storage.from("icon").upload(uuid, blob, {
    contentType: "image/png",
  });

  handleError(error);
};
