"use client";

import React, { useState, useCallback, memo } from "react";
import QuickReplies from "./QuickReplies";
import ChatSubmitButton from "./ChatSubmitButton";
import ChatAudioButton from "./ChatAudioButton";
import ChatAttachmentButton from "./ChatAttachmentButton";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  userId: string;
}

const ChatInput: React.FC<ChatInputProps> = memo(({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(event.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedMessage = message.trim();
      if (!trimmedMessage || isSending) return;

      setIsSending(true);

      try {
        await onSendMessage(trimmedMessage);
        setMessage(""); // Clear input only after successful send
      } catch (error) {
        console.error("Failed to send message:", error);
        // Keep the message in input if send fails
      } finally {
        setIsSending(false);
      }
    },
    [message, onSendMessage, isSending]
  );

  const handleQuickReply = useCallback(
    async (reply: string) => {
      if (isSending) return;

      setIsSending(true);
      try {
        await onSendMessage(reply);
      } catch (error) {
        console.error("Failed to send quick reply:", error);
      } finally {
        setIsSending(false);
      }
    },
    [onSendMessage, isSending]
  );

  return (
    <div className="bg-white p-4 space-y-2">
      {/* Quick replies */}
      <QuickReplies onQuickReply={handleQuickReply} />

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        {/* Attachment buttons */}
        <ChatAttachmentButton />

        <input
          className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Write your message here..."
          type="text"
          value={message}
          onChange={handleChange}
          disabled={isSending}
        />

        {message.trim() ? (
          // <button type="submit" disabled={isSending}>
          <ChatSubmitButton />
        ) : (
          // </button>
          <ChatAudioButton />
        )}
      </form>
    </div>
  );
});

ChatInput.displayName = "ChatInput";

export default ChatInput;
