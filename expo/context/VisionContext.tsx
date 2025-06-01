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

  const timingRef = useRef<number>(performance.now());
  const latestRef = useRef<number>(Date.now());
  const socketRef = useRef<WebSocket | null>(null);
  const historyRef = useRef<string[]>([]);

  const startWebsocket = useCallback(async () => {
    console.log("[VISION] Connecting to service...");

    if (socketRef.current) {
      console.log(
        "[VISION] Closing existing connection before reconnecting...",
      );

      socketRef.current.onopen = null;
      socketRef.current.onerror = null;
      socketRef.current.onclose = null;
      socketRef.current.onmessage = null;

      socketRef.current?.close();
      socketRef.current = null;
    }

    try {
      const session = await supabase.auth.getSession();
      const bearer = session?.data.session?.access_token;

      const localBase = `ffbbrrfdghbvuajheulg.supabase.co/functions/v1/vision`;
      const localUrl = `wss://${localBase}?token=${bearer}`;

      const localSocket = new WebSocket(localUrl);

      localSocket.onopen = () => console.log("[VISION] Connection established");
      localSocket.onerror = handleError;
      localSocket.onclose = handleClose;
      localSocket.onmessage = handleMessage;

      socketRef.current = localSocket;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleClose = () => {
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

      console.log(`[VISION] Response time: ${Math.round(timeDifference)}ms`);
    }
  };

  useEffect(() => {
    startWebsocket();

    return () => {
      if (socketRef.current) {
        console.log("[VISION] Cleaning up WebSocket on component unmount...");

        socketRef.current.onopen = null;
        socketRef.current.onerror = null;
        socketRef.current.onclose = null;
        socketRef.current.onmessage = null;

        socketRef.current.close();
        socketRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendImage = async (uri: string) => {
    // If we're still connecting no need to re-try
    if (socketRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    // If not open and not connecting attempt to reconnect
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      startWebsocket();
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

    socketRef.current.send(body);
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
