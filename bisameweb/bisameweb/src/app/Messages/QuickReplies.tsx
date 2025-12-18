import React from 'react';

interface QuickRepliesProps {
  onQuickReply: (reply: string) => void;
}

const quickReplies = [
  'Last price',
  'Make an offer',
  'Please call me',
  'Ok',
  'Thanks',
  'Still available?'
];

const QuickReplies: React.FC<QuickRepliesProps> = ({ onQuickReply }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {quickReplies.map((reply) => (
        <button
          key={reply}
          onClick={() => onQuickReply(reply)}
          className="border border-blue-300 text-blue-600 rounded-full px-4 py-2 text-sm font-medium hover:bg-blue-50 hover:border-blue-400 transition-colors"
        >
          {reply}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;
