import React, { memo } from "react";
import MessagesList from "./MessagesList";
import { Message } from "./types";

interface LeftChatPanelProps {
  messages: Message[];
  selectedMessage: Message | null;
  isLoadingChatContacts: boolean;
  onSelectMessage: (message: Message) => void;
}

const LeftChatPanel: React.FC<LeftChatPanelProps> = memo(
  ({ messages, selectedMessage, isLoadingChatContacts, onSelectMessage }) => {
    return (
      <div className="w-full lg:w-auto h-full flex flex-col border-r border-gray-100 bg-gray-50">
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <MessagesList
            messages={messages}
            selectedMessage={selectedMessage}
            isLoadingMessage={isLoadingChatContacts}
            onSelectMessage={onSelectMessage}
          />
        </div>
      </div>
    );
  }
);

LeftChatPanel.displayName = "LeftChatPanel";

export default LeftChatPanel;
