import useSocket from "@/app/Socket/useSocket";
import { APIChatMessage } from "../interfaces";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import useSWR from "swr";
import { ChatMessageStatus } from "../enum";
import axios from "axios";

interface ChatMessageSWR {
  data: {
    results: APIChatMessage[];
  };
}

interface ChatMessageSWR {
  data: {
    results: APIChatMessage[];
  };
}

export const fetcher = async (url: string): Promise<ChatMessageSWR> => {
  try {
    const { data } = await axios.get<ChatMessageSWR>(url);

    if (!data) {
      throw new Error("Error occurred fetching data");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const useFetchChats = (listingId: string, userId1: string, userId2: string) => {
  const { connect, on, off, isConnected } = useSocket("/", userId1);
  const [chatData, setChatData] = useState<APIChatMessage[]>([]);
  const isInitialMount = useRef(true);
  const handlersRegistered = useRef(false);

  const apiUrl = useMemo(() => {
    if (!listingId || !userId1 || !userId2) return null;
    return `/api/chatMessages?listingId=${encodeURIComponent(
      listingId
    )}&userId1=${encodeURIComponent(userId1)}&userId2=${encodeURIComponent(
      userId2
    )}`;
  }, [listingId, userId1, userId2]);

  const {
    data,
    isLoading: isChatLoading,
    mutate: refresh,
    error,
  } = useSWR<ChatMessageSWR>(apiUrl, fetcher, {
    refreshInterval: 5000,
    dedupingInterval: 2000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    keepPreviousData: true,
    revalidateIfStale: false,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    focusThrottleInterval: 5000,
  });

  // Stable handlers using useCallback with proper dependencies
  const handleNewMessage = useCallback(
    (msg: APIChatMessage) => {
      if (msg.listingId !== listingId) return;

      setChatData((prev) => {
        if (prev.some((m) => m.messageId === msg.messageId)) return prev;
        const newData = [...prev, msg];
        return newData.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    },
    [listingId]
  );

  const handleSent = useCallback((payload: { messageId: string }) => {
    setChatData((prev) =>
      prev.map((msg) =>
        msg.messageId === payload.messageId
          ? { ...msg, messageStatus: ChatMessageStatus.Sent }
          : msg
      )
    );
  }, []);

  const handleDelivered = useCallback((payload: { messageId: string }) => {
    setChatData((prev) =>
      prev.map((msg) =>
        msg.messageId === payload.messageId &&
        msg.messageStatus !== ChatMessageStatus.Read
          ? { ...msg, messageStatus: ChatMessageStatus.Delivered }
          : msg
      )
    );
  }, []);

  const handleRead = useCallback(
    (payload: { fromUserId: string; listingId: string }) => {
      if (payload.listingId !== listingId) return;

      setChatData((prev) =>
        prev.map((msg) =>
          msg.fromUserId === userId1 &&
          msg.toUserId === payload.fromUserId &&
          msg.listingId === payload.listingId
            ? { ...msg, messageStatus: ChatMessageStatus.Read }
            : msg
        )
      );
    },
    [listingId, userId1]
  );

  // Update chat data when SWR data changes
  useEffect(() => {
    if (!data?.data?.results) return;

    const incoming = data.data.results;

    incoming.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    setChatData((prev) => {
      if (prev.length === incoming.length) {
        const isSame = prev.every(
          (msg, idx) => msg.messageId === incoming[idx].messageId
        );
        if (isSame) return prev;
      }
      return incoming;
    });
  }, [data]);

  // Connect socket only once
  useEffect(() => {
    if (!userId1 || isConnected) return;

    const connectSocket = async () => {
      try {
        await connect();
      } catch (err) {
        console.error("Socket connection failed:", err);
      }
    };

    connectSocket();
  }, [userId1, isConnected, connect]);

  // Setup socket listeners only once
  useEffect(() => {
    if (!isConnected || handlersRegistered.current) return;

    const messageHandler = (...args: unknown[]) =>
      handleNewMessage(args[0] as APIChatMessage);
    const sentHandler = (...args: unknown[]) =>
      handleSent(args[0] as { messageId: string; status: "Sent" });
    const deliveredHandler = (...args: unknown[]) =>
      handleDelivered(args[0] as { messageId: string; status: "Delivered" });
    const readHandler = (...args: unknown[]) =>
      handleRead(
        args[0] as { fromUserId: string; listingId: string; status: "Read" }
      );

    on("message", messageHandler);
    on("sent", sentHandler);
    on("delivered", deliveredHandler);
    on("read", readHandler);

    handlersRegistered.current = true;

    return () => {
      off("message", messageHandler);
      off("sent", sentHandler);
      off("delivered", deliveredHandler);
      off("read", readHandler);
      handlersRegistered.current = false;
    };
  }, [
    isConnected,
    on,
    off,
    handleNewMessage,
    handleSent,
    handleDelivered,
    handleRead,
  ]);

  // Reset initial mount flag
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, []);

  return { chatData, isChatLoading, error, refresh, setChatData };
};

export default useFetchChats;
