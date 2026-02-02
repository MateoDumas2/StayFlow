"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface ListingPreview {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'listing-card' | 'options';
  options?: string[];
  listing?: ListingPreview;
}

const generateBotResponse = (input: string, t: any): Message => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('playa') || lowerInput.includes('mar') || lowerInput.includes('beach') || lowerInput.includes('sea')) {
    return {
      id: Date.now().toString(),
      text: t('chat.bot_response_beach'),
      sender: 'bot',
      timestamp: new Date(),
      type: 'listing-card',
      listing: {
        id: '101',
        title: 'Villa Ocean Breeze',
        location: 'Tulum, México',
        price: '$250/noche',
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
      }
    };
  }
  
  // Default response
  return {
    id: Date.now().toString(),
    text: t('chat.bot_response_default'),
    sender: 'bot',
    timestamp: new Date(),
    type: 'options',
    options: [t('chat.options.romantic'), t('chat.options.adventure'), t('chat.options.relax')]
  };
};

export const ChatWidget: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('chat.intro'),
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const botResponse = generateBotResponse(input, t);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleOptionClick = (option: string) => {
    const userMessage: Message = {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now().toString(),
      text: option,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    setTimeout(() => {
       // Simple hardcoded response for options
       let responseText = "Buscando las mejores opciones para ti...";
       if (option === 'Escapada Romántica') responseText = "¡Qué romántico! ❤️ Aquí tienes algunas opciones íntimas y acogedoras.";
       if (option === 'Aventura') responseText = "¡Espíritu aventurero! 🧗‍♂️ Mira estos lugares cerca de la acción.";

       setMessages(prev => [...prev, {
         id: (Date.now() + 1).toString(),
         text: responseText,
         sender: 'bot',
         timestamp: new Date(),
         type: 'text'
       }]);
       setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
          isOpen ? 'bg-gray-800 rotate-90' : 'bg-gradient-to-r from-primary to-secondary'
        } text-white`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">StayFlow AI</h3>
              <p className="text-white/80 text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                En línea ahora
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white text-ink border border-gray-100 shadow-sm rounded-tl-none'
                  }`}
                >
                  {msg.text}
                  
                  {/* Listing Card Preview */}
                  {msg.type === 'listing-card' && msg.listing && (
                    <div className="mt-3 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-shadow relative">
                      <div className="relative w-full h-24">
                        <Image 
                          src={msg.listing.image} 
                          alt={msg.listing.title} 
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="p-2">
                        <h4 className="font-bold text-ink text-xs">{msg.listing.title}</h4>
                        <p className="text-gray-500 text-[10px] flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {msg.listing.location}
                        </p>
                        <p className="text-primary font-bold text-xs mt-1">{msg.listing.price} <span className="font-normal text-gray-400">/ noche</span></p>
                      </div>
                    </div>
                  )}

                  {/* Options Buttons */}
                  {msg.type === 'options' && msg.options && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleOptionClick(opt)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-primary/10 hover:text-primary text-xs font-medium rounded-full transition-colors border border-gray-200"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
