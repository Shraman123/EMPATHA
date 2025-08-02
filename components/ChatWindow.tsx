
import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import ChatMessageBubble from './ChatMessageBubble';
import ChatInput from './ChatInput';
import SuggestionChips from './SuggestionChips';
import { LoadingDots } from './icons';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const showSuggestions = messages.length <= 2 && !isLoading;

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-3xl mx-auto h-full flex flex-col">
        <div className="flex-1 space-y-6">
          {messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && messages[messages.length-1]?.role !== 'user' && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 p-3 rounded-lg rounded-bl-none shadow-sm">
                <LoadingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-auto pt-4">
          {showSuggestions && <SuggestionChips onSelect={onSendMessage} />}
          <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
};

export default ChatWindow;
