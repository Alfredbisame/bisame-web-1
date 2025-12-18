"use client";

import useSocket from "@/app/Socket/useSocket";
import { useEffect, useCallback, useRef } from "react";
import { APIChatMessage } from "../interfaces";

const useSendChats = (userId: string) => {
  const { connect, emit, isConnected } = useSocket("/", userId);
  const connectionInitialized = useRef(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  // Initialize socket connection
  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ [useSendChats] No userId provided");
      return;
    }

    if (connectionInitialized.current) {
      return;
    }

    const initializeSocket = async () => {
      connectionInitialized.current = true;

      console.log("🔌 [useSendChats] Initializing socket connection...");

      try {
        await connect();
        console.log("✅ [useSendChats] Socket connected successfully");
        reconnectAttempts.current = 0;
      } catch (error) {
        console.error("❌ [useSendChats] Connection error:", error);
        connectionInitialized.current = false;

        // Retry connection
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(
            `🔄 Retry attempt ${reconnectAttempts.current}/${maxReconnectAttempts}`
          );
          setTimeout(() => {
            connectionInitialized.current = false;
            initializeSocket();
          }, 2000);
        }
      }
    };

    initializeSocket();

    return () => {
      console.log("🔌 [useSendChats] Cleaning up socket connection");
      connectionInitialized.current = false;
    };
  }, [userId, connect]);

  const chatHandler = useCallback(
    async (payload: APIChatMessage) => {
      console.log("📨 [chatHandler] Received payload:", payload);

      if (!userId) {
        console.error("❌ [chatHandler] No userId");
        throw new Error("User ID is required");
      }

      // Validate payload
      if (!payload.message || !payload.toUserId || !payload.listingId) {
        console.error("❌ [chatHandler] Invalid payload:", payload);
        throw new Error("Invalid message payload");
      }

      // Check connection status
      if (!isConnected) {
        console.warn(
          "⚠️ [chatHandler] Socket not connected, attempting to connect..."
        );

        try {
          await connect();
          console.log("✅ [chatHandler] Connected successfully");

          // Wait a bit for connection to stabilize
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error("❌ [chatHandler] Failed to connect:", error);
          throw new Error("Failed to establish socket connection");
        }
      }

      // Verify connection
      if (!isConnected) {
        console.error(
          "❌ [chatHandler] Still not connected after connect attempt"
        );
        throw new Error("Socket connection failed");
      }

      // Emit message
      try {
        console.log("📤 [chatHandler] Emitting message to socket...");
        emit("message", payload);
        console.log("✅ [chatHandler] Message emitted successfully");

        return true;
      } catch (error) {
        console.error("❌ [chatHandler] Emit error:", error);
        throw error;
      }
    },
    [userId, isConnected, connect, emit]
  );

  return {
    chatHandler,
    isConnected,
  };
};

export default useSendChats;
