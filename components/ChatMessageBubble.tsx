
import React from 'react';
import type { ChatMessage } from '../types';
import { MessageRole } from '../types';
import { UserIcon, BotIcon } from './icons';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;

  const wrapperClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-sky-500 text-white rounded-lg rounded-br-none'
    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg rounded-bl-none';
  const iconClasses = isUser ? 'text-sky-500' : 'text-sky-600 dark:text-sky-400';

  return (
    <div className={`${wrapperClasses} w-full`}>
      <div className="flex items-start space-x-3 max-w-xl">
        {!isUser && (
          <div className="w-8 h-8 flex-shrink-0 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <BotIcon className={`w-5 h-5 ${iconClasses}`} />
          </div>
        )}
        <div className={`p-3 md:p-4 shadow-sm ${bubbleClasses}`}>
          <p className="text-base whitespace-pre-wrap">{message.content}</p>
        </div>
        {isUser && (
          <div className="w-8 h-8 flex-shrink-0 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
             <UserIcon className={`w-5 h-5 ${iconClasses}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageBubble;
