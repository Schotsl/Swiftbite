import { supabase } from "../utils/supabase.ts";
import { handleError } from "../helper.ts";
import { generateVision } from "../utils/openai.ts";
import { validateUsage } from "../utils/usage.ts";

Deno.serve((request) => {
  const upgrade = request.headers.get("upgrade");

  if (!upgrade || upgrade.toLowerCase() != "websocket") {
    return new Response("Request isn't trying to upgrade to WebSocket.", {
      status: 400,
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(request);

  let user: string;

  socket.onopen = async () => {
    const token = request.url?.split("token=")[1];

    if (!token) {
      socket.send(JSON.stringify({ error: "No token provided" }));
      socket.close();

      return;
    }

    const { error, data } = await supabase.auth.getUser(token);

    handleError(error);

    if (!data.user) {
      socket.send(JSON.stringify({ error: "Invalid token" }));
      socket.close();

      return;
    }

    const response = await validateUsage(data.user.id);

    if (response) {
      socket.send(JSON.stringify({ error: response }));
      socket.close();

      return;
    }

    user = data.user.id;
  };

  socket.onmessage = async (event) => {
    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const base64 = event.data.toString();

    if (!base64) {
      socket.send(JSON.stringify({ error: "Please provide a base64 image" }));
      return;
    }

    const feedback = await generateVision(user, { base64 });
    const received = Date.now();

    socket.send(JSON.stringify({ feedback, received }));
  };

  return response;
});
