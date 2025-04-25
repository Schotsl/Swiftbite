import supabase from "@/utils/supabase";

import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
  ReactNode,
} from "react";

import * as FileSystem from "expo-file-system";

interface VisionContextProps {
  feedback: string | null;
  websocket: WebSocket | null;

  sendImage: (uri: string) => Promise<void>;
}

const VisionContext = createContext<VisionContextProps | undefined>(undefined);

interface VisionProviderProps {
  children: ReactNode;
}

export const VisionProvider: React.FC<VisionProviderProps> = ({ children }) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  const timingRef = useRef<number>(performance.now());
  const latestRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startWebsocket = async () => {
      console.log("[VISION] Connecting to service...");
      if (websocket) {
        websocket.close();
      }

      try {
        const session = await supabase.auth.getSession();
        const bearer = session?.data.session?.access_token;

        const localBase = `ffbbrrfdghbvuajheulg.supabase.co/functions/v1/vision`;
        const localUrl = `wss://${localBase}?token=${bearer}`;
        const localSocket = new WebSocket(localUrl);

        setWebsocket(localSocket);
      } catch {
        setFeedback("Failed to connect to vision service");
      }
    };

    startWebsocket();

    return () => {
      if (timingRef.current) {
        clearInterval(timingRef.current);
      }

      if (websocket) {
        websocket.onopen = null;
        websocket.onerror = null;
        websocket.onclose = null;
        websocket.onmessage = null;
        websocket.close();

        setWebsocket(null);
      }

      setFeedback("Disconnected from vision service");
    };
  }, []);

  useEffect(() => {
    if (!websocket) {
      return;
    }

    websocket.onopen = () => {
      console.log("[VISION] Connection established");
    };

    websocket.onmessage = (event: MessageEvent) => {
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

        setFeedback(message.feedback);

        const timeRecevied = performance.now();
        const timeDifference = timeRecevied - timingRef.current!;

        console.log(`[VISION] Response time: ${timeDifference}ms`);
      }
    };

    websocket.onerror = (error) => {
      console.error(error);

      setFeedback("Vision service error");
    };

    websocket.onclose = (event) => {
      console.log("[VISION] Connection closed");

      if (intervalRef.current) {
        clearInterval(intervalRef.current);

        intervalRef.current = null;
      }
    };

    return () => {
      if (websocket) {
        websocket.onopen = null;
        websocket.onmessage = null;
        websocket.onerror = null;
        websocket.onclose = null;
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [websocket]);

  const sendImage = async (uri: string) => {
    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
      console.log("[VISION] Connection not ready to send");

      return;
    }

    console.log("[VISION] Sending message");

    const options = { encoding: FileSystem.EncodingType.Base64 };
    const base64 = await FileSystem.readAsStringAsync(uri, options);
    const timing = performance.now();

    timingRef.current = timing;

    websocket.send(base64);
  };

  return (
    <VisionContext.Provider value={{ websocket, feedback, sendImage }}>
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
