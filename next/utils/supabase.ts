import { Tables } from "@/database.types";
import { handleError } from "@/helper";
import { createClient as createClientSupabase } from "@supabase/supabase-js";

export const supabase = createClientSupabase(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

export async function getUser(request: Request) {
  const header = request.headers.get("Authorization");

  if (!header) {
    return;
  }

  const token = header.replace("Bearer ", "");

  const { error, data } = await supabase.auth.getUser(token);

  handleError(error);

  const uuid = data.user?.id;
  return uuid;
}

export const fetchUrl = async (generativeUUID: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from("generative")
    .createSignedUrl(`${generativeUUID}`, 3600);

  handleError(error);

  return data!.signedUrl;
};

export const fetchProduct = async (
  productUUID: string,
): Promise<Tables<"product">> => {
  const { data, error } = await supabase
    .from("product")
    .select("*")
    .eq("uuid", productUUID)
    .single();

  handleError(error);

  return data;
};

export const fetchProductByBarcode = async (
  barcode: string,
): Promise<Tables<"product"> | null> => {
  const { data, error } = await supabase
    .from("product")
    .select("*")
    .eq("barcode", barcode);

  handleError(error);

  const product = data?.[0];
  return product ?? null;
};

export const fetchEntry = async (
  productId: string,
): Promise<Tables<"entry">> => {
  const { data, error } = await supabase
    .from("entry")
    .select("*")
    .eq("product_id", productId)
    .single();

  handleError(error);

  return data;
};

export const fetchGenerative = async (
  generativeUUID: string,
): Promise<Tables<"generative">> => {
  const { data, error } = await supabase
    .from("generative")
    .select("*")
    .eq("uuid", generativeUUID)
    .single();

  handleError(error);

  return data;
};

export const fetchIcon = async (title: string) => {
  const { error, data } = await supabase
    .from("icon")
    .select("uuid")
    .eq("title", title);

  handleError(error);

  // We can't use single since it will throw an error if the data is empty
  const icons = data || [];
  return icons[0]?.uuid;
};

export const updateProduct = async (product: string, icon: string) => {
  const { error } = await supabase
    .from("product")
    .update({ icon_id: icon })
    .eq("uuid", product);

  handleError(error);
};

export const updateMeal = async (meal: string, icon: string) => {
  const { error } = await supabase
    .from("meal")
    .update({ icon_id: icon })
    .eq("uuid", meal);

  handleError(error);
};

export const uploadIcon = async (uuid: string, array: Uint8Array) => {
  const { error } = await supabase.storage.from("icon").upload(uuid, array, {
    contentType: "image/png",
  });

  handleError(error);
};

export const insertIcon = async (title: string) => {
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
