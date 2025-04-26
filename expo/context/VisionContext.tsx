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

  resetHistory: () => void;
  resetFeedback: () => void;
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
  const historyRef = useRef<string[]>([]);
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

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
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

      setFeedback(message.feedback);

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

    if (intervalRef.current) {
      clearInterval(intervalRef.current);

      intervalRef.current = null;
    }
  };

  const handleError = (error: Event) => {
    console.error(error);

    setFeedback("Vision service error");
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
    historyRef.current = [];
  };

  const resetFeedback = () => {
    setFeedback(null);
  };

  return (
    <VisionContext.Provider
      value={{
        websocket,
        feedback,
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
