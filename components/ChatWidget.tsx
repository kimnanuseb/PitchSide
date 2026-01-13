import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { Send, User, Bot, Users } from 'lucide-react';
import { getChatBotResponse } from '../services/geminiService';

interface ChatWidgetProps {
  matchContext: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ matchContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'System', text: 'Welcome to the live chat! Be respectful.', timestamp: Date.now(), isSystem: true },
    { id: '2', user: 'SportsFan99', text: 'Who do you guys think will win?', timestamp: Date.now() - 50000 },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [onlineCount, setOnlineCount] = useState(1240);
  const [notification, setNotification] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Dynamic User Count & Join Notifications
  useEffect(() => {
    const randomNames = ["RugbyLad", "ScrumMaster", "LineOutKing", "TackleBox", "TryTime", "RefBlind", "Fullback01", "WingerFast", "PropLife", "HookerT"];
    
    const interval = setInterval(() => {
      // Fluctuate count slightly
      const change = Math.floor(Math.random() * 7) - 3; // Random number between -3 and +3
      
      setOnlineCount(prev => {
        const newCount = prev + change;
        return newCount < 800 ? 800 : newCount; // Minimum floor
      });

      // Occasional "User Joined" popup (only when count increases)
      if (change > 1 && Math.random() > 0.6) {
        const name = randomNames[Math.floor(Math.random() * randomNames.length)] + Math.floor(Math.random() * 100);
        setNotification(`${name} joined the live chat`);
        
        // Clear notification after 2 seconds
        setTimeout(() => {
          setNotification(null);
        }, 2000);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      text: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue('');

    // Gemini interaction trigger (simulated command or random)
    if (currentInput.toLowerCase().includes('@ai') || Math.random() > 0.7) {
        const cleanInput = currentInput.replace('@ai', '').trim();
        // Artificial delay for realism
        setTimeout(async () => {
            const botResponse = await getChatBotResponse(cleanInput || "What do you think?", matchContext);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                user: 'Gemini AI',
                text: botResponse,
                timestamp: Date.now(),
                isSystem: true // Styling hack for bot
            }]);
        }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-brand-card border border-slate-700 rounded-xl overflow-hidden relative">
      <div className="p-3 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
        <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
            <Users size={14} className="text-slate-400" /> Live Chat
        </h3>
        <span className="text-[10px] text-green-400 flex items-center gap-1 font-mono">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
          {onlineCount.toLocaleString()} Online
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-900/50 relative">
        {/* Toast Notification */}
        {notification && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-slate-800/90 text-brand-accent text-[10px] px-3 py-1 rounded-full border border-slate-700 shadow-lg backdrop-blur-sm z-10 animate-pulse transition-all">
                {notification}
            </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.user === 'You' ? 'flex-row-reverse' : ''}`}>
             <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.isSystem ? 'bg-purple-600' : 'bg-slate-600'}`}>
                {msg.isSystem ? <Bot size={14} className="text-white" /> : <User size={14} className="text-slate-300" />}
             </div>
             <div className={`flex flex-col max-w-[80%] ${msg.user === 'You' ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-slate-500 mb-0.5">{msg.user}</span>
                <div className={`px-3 py-1.5 rounded-lg text-sm ${
                    msg.isSystem ? 'bg-purple-900/50 text-purple-100 border border-purple-500/30' : 
                    msg.user === 'You' ? 'bg-brand-accent text-white' : 'bg-slate-700 text-slate-200'
                }`}>
                  {msg.text}
                </div>
             </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message (mention @ai)..."
          className="flex-1 bg-slate-900 border border-slate-600 rounded text-sm text-white px-3 focus:outline-none focus:border-brand-accent transition-colors"
        />
        <button type="submit" className="p-2 bg-brand-accent text-white rounded hover:bg-blue-600 transition-colors">
            <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatWidget;