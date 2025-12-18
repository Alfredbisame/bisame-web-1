"use client";
import React, { memo } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { Message } from "./types";
import StartConversation from "./StartConversation";
import { ChatsPayload } from "./interfaces";

interface ChatAreaProps {
  selectedMessage: Message | null;
  currentUserId: string;
  onSendMessage: (content: string) => void;
  messageSearchParams: ChatsPayload;
}

const ChatArea: React.FC<ChatAreaProps> = memo(
  ({ selectedMessage, currentUserId, messageSearchParams, onSendMessage }) => {
    if (!selectedMessage) {
      return <StartConversation />;
    }

    return (
      <section className="flex-1 flex flex-col bg-gray-50 min-h-full overflow-hidden">
        <ChatHeader selectedMessage={selectedMessage} />
        <ChatMessages
          currentUserId={currentUserId}
          messageSearchParams={messageSearchParams}
        />
        <ChatInput userId={currentUserId} onSendMessage={onSendMessage} />
      </section>
    );
  }
);

ChatArea.displayName = "ChatArea";

export default ChatArea;
