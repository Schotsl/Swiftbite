// import { fetchTitle } from "../../../services/openai";

export async function POST(request: Request) {
  const body = await request.json();

  console.log(body);

  // const responseData = await fetchTitle(image);
  // const responseParsed = JSON.stringify({ title: responseData });

  return new Response("{}", { status: 200 });
}
