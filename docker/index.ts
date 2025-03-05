import { removeBackground, resizeImage, trimImage } from "./utils/system";
import { generateIcon, normalizeTitle } from "./utils/openai";
import { handleError } from "./helper";
import { decode } from "base64-arraybuffer";

import supabase from "./utils/supabase";

Bun.serve({
  port: 3000,
  fetch: async (request) => {
    const url = new URL(request.url);

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (url.pathname !== `/api/handle-ingredient-database`) {
      return new Response("Not Found", { status: 404 });
    }

    const body = await request.json();

    const ingredientIcon = body.record.icon_id;
    const ingredientUuid = body.record.uuid;
    const ingredientTitle = body.record.title;

    // If the ingredient already has an icon or is missing a title we'll skip it
    if (ingredientIcon || !ingredientTitle) {
      return new Response("{}", { status: 200 });
    }

    const after = async () => {
      // Normalize the title and look it up in the database
      console.log(`[AI] Normalizing title for "${ingredientTitle}"`);
      const iconTitle = await normalizeTitle(ingredientTitle);

      console.log(`[Database] Looking up icon for "${iconTitle}"`);
      const iconUuid = await selectIcon(iconTitle);

      // If the icon already exists we'll update the ingredient
      if (iconUuid) {
        console.log(`[Database] Updating ingredient with icon "${iconUuid}"`);

        await updateIngredient(ingredientUuid, iconUuid);

        return new Response("{}", { status: 200 });
      }

      const imagePipeline = async () => {
        console.log(`[AI] Generating icon for "${iconTitle}"`);
        const originalBase64 = await generateIcon(iconTitle);
        const originalBuffer = decode(originalBase64);

        Bun.write(`.tmp/${ingredientUuid}-original.png`, originalBuffer);

        console.log(`[System] Removing background for "${iconTitle}"`);
        await removeBackground(
          `.tmp/${ingredientUuid}-original.png`,
          `.tmp/${ingredientUuid}-transparent.png`,
        );

        console.log(`[System] Trimming image for "${iconTitle}"`);
        await trimImage(
          `.tmp/${ingredientUuid}-transparent.png`,
          `.tmp/${ingredientUuid}-trimmed.png`,
        );

        console.log(`[System] Resizing image for "${iconTitle}"`);
        await resizeImage(
          `.tmp/${ingredientUuid}-trimmed.png`,
          `.tmp/${ingredientUuid}.png`,
        );

        const outputFile = Bun.file(`.tmp/${ingredientUuid}.png`);
        const outputBuffer = await outputFile.arrayBuffer();

        return outputBuffer;
      };

      const databasePipeline = async () => {
        console.log(`[Database] Inserting icon "${iconTitle}"`);
        const insertUuid = await insertIcon(iconTitle);

        return insertUuid;
      };

      // We'll run both pipelines in parallel
      const [blob, uuid] = await Promise.all([
        imagePipeline(),
        databasePipeline(),
      ]);

      // We'll upload the icon and update the ingredient
      console.log(`[Storage] Uploading icon "${iconTitle}"`);
      await uploadIcon(uuid, blob);

      console.log(`[Database] Updating ingredient with icon "${iconTitle}"`);
      await updateIngredient(ingredientUuid, uuid);

      // This could be ran in parallel but it's just a backup step so no need to rush
      const fileOutput = Bun.file(`.tmp/${ingredientUuid}.png`);
      const fileTrimmed = Bun.file(`.tmp/${ingredientUuid}-trimmed.png`);
      const fileOriginal = Bun.file(`.tmp/${ingredientUuid}-original.png`);
      const fileTransparent = Bun.file(
        `.tmp/${ingredientUuid}-transparent.png`,
      );

      // Upload the remaining images
      const trimmedBuffer = await fileTrimmed.arrayBuffer();
      const originalBuffer = await fileOriginal.arrayBuffer();
      const transparentBuffer = await fileTransparent.arrayBuffer();

      console.log(`[Storage] Uploading additional images for "${iconTitle}"`);
      await uploadIcon(`${uuid}-trimmed`, trimmedBuffer);
      await uploadIcon(`${uuid}-original`, originalBuffer);
      await uploadIcon(`${uuid}-transparent`, transparentBuffer);

      // Delete the temporary files
      console.log(`[System] Cleaning up temporary files for "${iconTitle}"`);
      await fileOutput.delete();
      await fileTrimmed.delete();
      await fileOriginal.delete();
      await fileTransparent.delete();
    };

    after();

    return new Response("{}", { status: 200 });
  },
});

// These functions are a bit ugly but they're just to keep the above code simple
const updateIngredient = async (ingredient: string, icon: string) => {
  const { error } = await supabase
    .from("ingredient")
    .update({ icon_id: icon })
    .eq("uuid", ingredient);

  handleError(error);
};

const selectIcon = async (title: string) => {
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

const uploadIcon = async (uuid: string, blob: ArrayBuffer) => {
  const { error } = await supabase.storage.from("icon").upload(uuid, blob, {
    contentType: "image/png",
  });

  handleError(error);
};
