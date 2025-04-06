import { handleError } from "@/helper";
import { generateIcon } from "@/utils/icon";
import { normalizeTitle } from "@/utils/openai";
import { after } from "next/server";

import { supabase } from "@/utils/supabase";
import { validateUsage } from "@/utils/usage";

export const maxDuration = 120;

export async function POST(request: Request) {
  // Make sure the user isn't over their usage limits
  const body = await request.json();
  const user = body.record.user_id;

  const response = await validateUsage(user);

  if (response) {
    return response;
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
  if (productTitleOld || productIcon) {
    return new Response("{}", { status: 200 });
  }

  // If the product already has an icon we don't need to
  if (productIcon) {
    return new Response("{}", { status: 200 });
  }

  after(async () => {
    // Normalize the title and look it up in the database
    console.log(`[ICON] Normalizing title`);
    const iconTitle = await normalizeTitle(user, productTitleNew);
    const iconUuid = await fetchIcon(iconTitle);

    // If the icon already exists we'll update the product
    if (iconUuid) {
      await updateProduct(productUuid, iconUuid);

      return;
    }

    const insertUuid = await insertIcon(iconTitle);

    await generateIcon(insertUuid, iconTitle);
    await updateProduct(productUuid, insertUuid);
  });

  return new Response("{}", { status: 200 });
}

const updateProduct = async (product: string, icon: string) => {
  console.log(`[ICON] Updating product with icon`);

  const { error } = await supabase
    .from("product")
    .update({ icon_id: icon })
    .eq("uuid", product);

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
