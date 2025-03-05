import { handleError } from "@/helper";
import { removeBackground } from "@/utils/background";
import { generateIcon, normalizeTitle } from "@/utils/openai";
import supabase from "@/utils/supabase";

export async function GET(request: Request) {
  const body = await request.json();

  console.log(body);

  return new Response("{}", { status: 200 });

  const title = await normalizeTitle("BigMac");

  console.log(`[Icon] Looking up ${title}`);

  const { error: fetchError, data: fetchData } = await supabase
    .from("icon")
    .select("uuid")
    .eq("title", title);

  handleError(fetchError);

  const fetchSafe = fetchData || [];
  const fetchUuid = fetchSafe[0]?.uuid;

  if (fetchUuid) {
    return;
  }

  console.log(`[Icon] Generating ${title}...`);

  const base64 = await generateIcon(title);

  console.log(`[Icon] Removing background...`);

  const blob = await removeBackground(base64);

  console.log(`[Icon] Inserting icon into database`);

  // const content = decode(base64);
  const contentType = "image/jpeg";

  const { error: iconError, data: iconData } = await supabase
    .from("icon")
    .insert({
      title,
    })
    .select("uuid")
    .single();

  handleError(iconError);

  const insertUuid = iconData!.uuid;

  console.log(`[Icon] Uploading icon to storage`);

  const { error: bucketError } = await supabase.storage
    .from("icon")
    .upload(insertUuid, blob, {
      contentType,
    });

  handleError(bucketError);
}
