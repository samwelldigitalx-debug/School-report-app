import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Input } from './ui';
import { MessageSquare, Send, X, Bot, User, Sparkles, Calculator, History, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { GoogleGenAI } from "@google/genai";

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your EduResult AI Assistant. I can help you with result calculations, performance analysis, and generating professional comments. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        throw new Error("Gemini API Key is missing or not configured. Please add your GEMINI_API_KEY to the Secrets panel in AI Studio.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: "You are an AI assistant for a Nigerian school result management system. You help teachers and admins with grading, comments, and data analysis. Be professional, helpful, and concise.",
        }
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text || "I'm sorry, I couldn't process that request.",
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('AI Error:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: err instanceof Error ? err.message : "An unexpected error occurred while connecting to the AI. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { label: 'Calculate Grade', icon: <Calculator size={14} />, prompt: 'Calculate grade for 78' },
    { label: 'Teacher Comment', icon: <MessageSquare size={14} />, prompt: 'Generate teacher comment for 82% average' },
    { label: 'Performance Analysis', icon: <TrendingUp size={14} />, prompt: 'Analyze JSS2 performance' },
    { label: 'Weak Students', icon: <AlertCircle size={14} />, prompt: 'List students below pass mark' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]" dir="ltr">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">AI Academic Assistant</h1>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Powered by Gemini AI</p>
          </div>
        </div>
      </div>

      <Card className="flex-1 flex flex-col border-0 shadow-xl overflow-hidden bg-gray-50">
        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 p-6 overflow-y-auto space-y-6 scroll-smooth"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex items-start space-x-3",
                msg.sender === 'user' && "flex-row-reverse space-x-reverse"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-md flex-shrink-0",
                msg.sender === 'ai' ? "bg-blue-600" : "bg-gray-800"
              )}>
                {msg.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl shadow-sm border text-left",
                msg.sender === 'ai' 
                  ? "bg-white border-gray-100 rounded-tl-none text-gray-800" 
                  : "bg-blue-600 border-blue-500 rounded-tr-none text-white"
              )}>
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <p className={cn(
                  "text-[10px] mt-2 font-bold uppercase tracking-widest opacity-50",
                  msg.sender === 'user' ? "text-blue-100" : "text-gray-400"
                )}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Bot size={16} />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-left">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-3 bg-white border-t border-gray-100 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 flex-shrink-0">Suggestions:</span>
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => setInput(action.prompt)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-blue-100 transition-colors flex-shrink-0"
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center space-x-3"
          >
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your school data..." 
                className="w-full py-3 pl-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium shadow-inner text-left"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 opacity-50">
                <Sparkles size={18} />
              </div>
            </div>
            <Button 
              type="submit" 
              className="rounded-xl p-3 shadow-lg shadow-blue-200"
              disabled={!input.trim() || isTyping}
            >
              <Send size={20} />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
