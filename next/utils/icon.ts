export async function generateIcon(uuid: string, title: string) {
  const body = JSON.stringify({
    uuid,
    title,
  });

  const method = "POST";
  const headers = {
    "Content-Type": "application/json",
    "X-Api-Key": process.env.SWIFTBITE_API_KEY!,
  };

  const response = await fetch(
    "https://swiftbite.dev.hedium.nl/generate-icon",
    {
      body,
      method,
      headers,
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  }
}
