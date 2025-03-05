export async function removeBackground(base64: string) {
  const method = "POST";
  const headers = {
    "X-Api-Key": process.env.REMOVE_BG_API_KEY!,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    crop: true,
    format: "png",
    shadow_type: "car",
    shadow_opacity: 100,
    image_file_b64: base64,
  });

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method,
    headers,
    body,
  });

  const blob = await response.blob();
  return blob;
}
