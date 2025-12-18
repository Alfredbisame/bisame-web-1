import React from "react";
import MessageItem from "./MessageItem";
import { Message } from "./types";

interface MessagesListProps {
  messages: Message[];
  isLoadingMessage?: boolean;
  selectedMessage: Message | null;
  onSelectMessage: (message: Message) => void;
}

const LoadingSkeleton = () => (
  <section className="w-90 max-h-full bg-white border-r border-gray-200 flex flex-col overflow-y-auto p-4">
    <div className="flex gap-3">
      <div
        className={`flex items-center bg-gray-200 animate-pulse justify-center w-12 h-12 rounded-full`}
      ></div>
      <div className="space-y-2">
        <p className="h-4 w-20 bg-gray-200 animate-pulse"></p>
        <p className="h-4 w-40 bg-gray-200 animate-pulse"></p>
      </div>
    </div>
  </section>
);

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isLoadingMessage,
  selectedMessage,
  onSelectMessage,
}) => {
  if (isLoadingMessage) {
    return (
      <>
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </>
    );
  }

  return (
    <section className="w-90 max-h-full bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-100">
          {messages
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )
            .map((message, index) => (
              <MessageItem
                key={index}
                message={message}
                isSelected={selectedMessage?.id === message.id}
                onClick={() => onSelectMessage(message)}
              />
            ))}
        </ul>
      </div>
    </section>
  );
};

export default MessagesList;
