import supabase from "@/utils/supabase";

import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
  ReactNode,
  useCallback,
} from "react";

import * as FileSystem from "expo-file-system";

interface VisionContextProps {
  feedback: string | null;
  feedbackOld: string | null;

  websocket: WebSocket | null;

  sendImage: (uri: string) => Promise<void>;

  resetHistory: () => void;
  resetFeedback: () => void;
}

const VisionContext = createContext<VisionContextProps | undefined>(undefined);

interface VisionProviderProps {
  children: ReactNode;
}

export const VisionProvider: React.FC<VisionProviderProps> = ({ children }) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackOld, setFeedbackOld] = useState<string | null>(null);

  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  const timingRef = useRef<number>(performance.now());
  const latestRef = useRef<number>(Date.now());
  const historyRef = useRef<string[]>([]);

  const startWebsocket = useCallback(async () => {
    console.log("[VISION] Connecting to service...");

    if (websocket) {
      console.log(
        "[VISION] Closing existing connection before reconnecting..."
      );

      websocket.onopen = null;
      websocket.onerror = null;
      websocket.onclose = null;
      websocket.onmessage = null;

      websocket.close();

      setWebsocket(null);
    }

    try {
      const session = await supabase.auth.getSession();
      const bearer = session?.data.session?.access_token;

      const localBase = `ffbbrrfdghbvuajheulg.supabase.co/functions/v1/vision`;
      const localUrl = `wss://${localBase}?token=${bearer}`;
      const localSocket = new WebSocket(localUrl);

      setWebsocket(localSocket);
    } catch (error) {
      console.error(error);
    }
  }, [websocket]);

  useEffect(() => {
    startWebsocket();

    return () => {
      if (websocket) {
        console.log("[VISION] Cleaning up WebSocket on component unmount...");

        websocket.onopen = null;
        websocket.onerror = null;
        websocket.onclose = null;
        websocket.onmessage = null;

        websocket.close();

        setWebsocket(null);
      }
    };
  }, []);

  useEffect(() => {
    if (!websocket) {
      return;
    }

    websocket.onopen = () => {
      console.log("[VISION] Connection established");
    };

    websocket.onerror = handleError;
    websocket.onclose = handleClose;
    websocket.onmessage = handleMessage;

    return () => {
      if (websocket) {
        websocket.onopen = null;
        websocket.onmessage = null;
        websocket.onerror = null;
        websocket.onclose = null;
      }
    };
  }, [websocket]);

  const handleMessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data);

    if (message.error) {
      setFeedback(message.error);

      return;
    }

    if (message.feedback !== undefined) {
      // Make sure the message is the latest
      if (message.received < latestRef.current) {
        return;
      }

      latestRef.current = message.received;

      setFeedback((previous) => {
        setFeedbackOld(previous);

        return message.feedback;
      });

      // Update the history but cap at 3 messages
      if (historyRef.current.length >= 3) {
        historyRef.current.shift();
      }

      historyRef.current.push(message.feedback);

      // Log the response time
      const timeRecevied = performance.now();
      const timeDifference = timeRecevied - timingRef.current!;

      console.log(`[VISION] Response time: ${timeDifference}ms`);
    }
  };

  const handleClose = (event: CloseEvent) => {
    console.log("[VISION] Connection closed");
    console.log("[VISION] Attempting to reconnect in 5 seconds...");

    setTimeout(() => {
      startWebsocket();
    }, 5000);
  };

  const handleError = (error: Event) => {
    console.error(error);

    // On error we'll attempt to reconnect
    startWebsocket();
  };

  const sendImage = async (uri: string) => {
    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
      console.log("[VISION] Connection not ready to send");

      return;
    }

    console.log("[VISION] Sending message");

    const history = historyRef.current;
    const options = { encoding: FileSystem.EncodingType.Base64 };
    const base64 = await FileSystem.readAsStringAsync(uri, options);
    const timing = performance.now();
    const body = JSON.stringify({
      base64,
      history,
    });

    timingRef.current = timing;

    websocket.send(body);
  };

  const resetHistory = () => {
    historyRef.current = [
      `Er is geen voedsel of product gedetecteerd`,
      `Er is geen voedsel of product gedetecteerd`,
      `Er is geen voedsel of product gedetecteerd`,
    ];
  };

  const resetFeedback = () => {
    setFeedback(null);
  };

  return (
    <VisionContext.Provider
      value={{
        feedback,
        feedbackOld,
        websocket,
        sendImage,
        resetHistory,
        resetFeedback,
      }}
    >
      {children}
    </VisionContext.Provider>
  );
};

export const useVision = (): VisionContextProps => {
  const context = useContext(VisionContext);

  if (context === undefined) {
    throw new Error("useVision must be used within a VisionProvider");
  }

  return context;
};
