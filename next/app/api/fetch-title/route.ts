import { fetchTitle } from "../../../services/openai";

export async function POST(request: Request) {
  const { image } = await request.json();

  const responseData = await fetchTitle(image);
  const responseParsed = JSON.stringify({ title: responseData });

  return new Response(responseParsed, { status: 200 });
}
