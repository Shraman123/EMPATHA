
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Chat } from "@google/genai";
import { createChat } from './services/geminiService';
import type { ChatMessage } from './types';
import { MessageRole } from './types';
import ChatWindow from './components/ChatWindow';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const chatRef = useRef<Chat | null>(null);

  const initializeChat = useCallback(async () => {
    try {
      setIsLoading(true);
      const chat = createChat();
      chatRef.current = chat;
      
      // Send an initial empty message to get the bot's greeting
      const responseStream = await chat.sendMessageStream({ message: "" });
      
      const botMessageId = Date.now().toString();
      setMessages([{ id: botMessageId, role: MessageRole.BOT, content: '' }]);

      for await (const chunk of responseStream) {
        const chunkText = chunk.text;
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === botMessageId ? { ...msg, content: msg.content + chunkText } : msg
          )
        );
      }
    } catch (error) {
      console.error("Initialization failed:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: MessageRole.BOT,
        content: "Sorry, I couldn't connect. Please check the API key and refresh the page.",
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (text: string) => {
    if (isLoading || !text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: text,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    // Add a placeholder for the bot's response
    setMessages(prev => [...prev, { id: botMessageId, role: MessageRole.BOT, content: '' }]);

    try {
      if (chatRef.current) {
        const responseStream = await chatRef.current.sendMessageStream({ message: text });
        for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === botMessageId ? { ...msg, content: msg.content + chunkText } : msg
              )
            );
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorContent = "I'm having trouble connecting right now. Please try again in a moment.";
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === botMessageId ? { ...msg, content: errorContent } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen font-sans bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-sm p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-sky-600 dark:text-sky-400">Empatha</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Your Mental Wellness Companion</p>
        </div>
      </header>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default App;
