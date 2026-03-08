'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { getAllProducts } from '@/data/products';

type Message = {
  id: string;
  role: 'user' | 'bot';
  text: string;
  time: string;
  links?: { label: string; url: string }[];
};

const QUICK_REPLIES = [
  { 
    label: 'Browse Products', 
    response: "Explore our entire collection of elite workstations and thin-and-lights right here.", 
    links: [{ label: 'View All Products', url: '/products' }] 
  },
  { 
    label: 'Repair Service', 
    response: "Satya Computers offers professional chip-level repairs. Visit our hardware studio in Ameerpet, Hyderabad!", 
    links: [{ label: 'Get Directions', url: '/contact' }] 
  },
  { 
    label: 'Today\'s Offers', 
    response: "We have massive deals on refurbished high-performance Dell and Apple machines right now.", 
    links: [{ label: 'Explore Deals', url: '/products' }] 
  },
];

const getInitialMessage = (): Message => ({
  id: 'init',
  role: 'bot',
  text: 'Hi! I am the Satya Computers assistant. How can I help you find the perfect laptop or workstation today?',
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
});

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const products = getAllProducts();

  const resetChat = () => {
    setMessages([getInitialMessage()]);
    setInputValue('');
    setIsTyping(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open, isTyping]);

  const addMessage = (role: 'user' | 'bot', text: string, links?: { label: string; url: string }[]) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role,
      text,
      links,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const botResponse = (userText: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let response = "I'm not exactly sure about that. Would you like to speak with our tech experts directly? Call us at +91 8309178589!";
      let responseLinks: { label: string; url: string }[] = [];
      
      const lowerText = userText.toLowerCase().trim();

      // Product/Brand Logic
      const foundProducts = products.filter(p => 
        lowerText.includes(p.brand.toLowerCase()) || 
        lowerText.includes(p.name.toLowerCase()) ||
        lowerText.includes(p.category?.toLowerCase() || '') ||
        (p.specs.processor && lowerText.includes(p.specs.processor.toLowerCase()))
      ).slice(0, 3); // Return top 3 matches

      if (foundProducts.length > 0) {
        response = `I found some excellent ${foundProducts[0].brand || 'hardware'} options matching your request. Here are the top matches:`;
        responseLinks = foundProducts.map(p => ({
          label: `View ${p.name}`,
          url: `/products/${p.slug}`
        }));
      }
      // Greetings
      else if (lowerText.match(/^(hi|hello|hey|hola|greetings)/)) {
        response = "Hello! I'm the Satya Computers AI assistant. How can I help you with your tech requirements today?";
      } 
      // Address
      else if (lowerText.includes('where') || lowerText.includes('location') || lowerText.includes('address')) {
        response = "We are located at: 27, Satyam Theatre Rd, Ameerpet, Hyderabad. Come visit our studio!";
        responseLinks = [{ label: 'View Map', url: '/contact' }];
      }
      // Repairs
      else if (lowerText.includes('repair') || lowerText.includes('fix') || lowerText.includes('screen') || lowerText.includes('broken')) {
        response = "We specialize in professional chip-level hardware repairs. Bring your device to our store in Ameerpet!";
        responseLinks = [{ label: 'Contact Us', url: '/contact' }];
      }
      // Contact
      else if (lowerText.includes('contact') || lowerText.includes('call') || lowerText.includes('number')) {
        response = "You can reach us at +91 8309178589. We are available 10 AM to 8 PM.";
        responseLinks = [{ label: 'Visit Contact Page', url: '/contact' }];
      }
      // General Laptop Advice
      else if (lowerText.includes('gaming') || lowerText.includes('student') || lowerText.includes('work') || lowerText.includes('laptop')) {
        response = "We have high-performance laptops suitable for gaming, students, and professionals! Check our catalog for the exact specifications you need.";
        responseLinks = [{ label: 'Browse PCs', url: '/products' }];
      }

      addMessage('bot', response, responseLinks);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const text = inputValue;
    addMessage('user', text);
    setInputValue('');
    botResponse(text);
  };

  const handleQuickReply = (label: string, response: string, links?: {label: string, url: string}[]) => {
    addMessage('user', label);
    setIsTyping(true);
    setTimeout(() => {
      addMessage('bot', response, links);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-7 sm:right-7 z-[9999]">
      {open && (
        <div className="mb-4 bg-white border border-black/5 shadow-2xl w-[calc(100vw-2rem)] max-w-[400px] h-[500px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 rounded-lg">
          {/* Header - Unified with Studio White */}
          <div className="bg-white text-brand-text p-5 flex justify-between items-center font-heading border-b border-black/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-brand-primary)] flex items-center justify-center rounded-sm">
                <MessageSquare size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl tracking-widest leading-none">SATYA CHAT</span>
                <span className="text-[10px] text-green-500 font-body items-center flex gap-1 mt-1 uppercase tracking-tighter">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online Now
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetChat}
                aria-label="Reset Chat"
                title="Start a new conversation"
                className="text-brand-text/30 hover:text-[var(--color-brand-primary)] transition-colors"
              >
                <RotateCcw size={18} />
              </button>
              <button onClick={() => setOpen(false)} aria-label="Close Chat" className="text-brand-text/40 hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-[var(--color-brand-primary)] text-white rounded-2xl rounded-tr-none' 
                    : 'bg-[#F9F9F9] text-brand-text border border-black/5 rounded-2xl rounded-tl-none'
                }`}>
                  <p className="font-body text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  
                  {m.links && m.links.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2">
                       {m.links.map((link, i) => (
                         <Link 
                           key={i} 
                           href={link.url} 
                           onClick={() => setOpen(false)}
                           className="text-xs font-heading tracking-widest bg-white border border-brand-primary/20 text-brand-primary py-2 px-3 text-center hover:bg-brand-primary hover:text-white transition-all uppercase"
                         >
                           {link.label} —
                         </Link>
                       ))}
                    </div>
                  )}

                  <span className={`text-[9px] block mt-2 opacity-40 uppercase tracking-widest ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#F9F9F9] border border-black/5 rounded-2xl rounded-tl-none p-4">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-brand-text/20 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-brand-text/20 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-brand-text/20 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
            
            {messages.length < 3 && !isTyping && (
              <div className="pt-2 flex flex-wrap gap-2">
                {QUICK_REPLIES.map((q) => (
                  <button 
                    key={q.label}
                    type="button"
                    onClick={() => handleQuickReply(q.label, q.response, q.links)}
                    className="text-[10px] uppercase tracking-widest py-2 px-4 border border-black/10 text-brand-text-muted hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] bg-white transition-all rounded-full"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer Input - Studio White Style */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-black/5 flex gap-3">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about Dell, HP, repairs..."
              className="flex-1 bg-[#F9F9F9] border border-black/5 text-brand-text p-3 text-sm focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors rounded-lg"
            />
            <button 
              type="submit"
              aria-label="Send Message"
              className="bg-[var(--color-brand-primary)] text-white p-3 hover:scale-105 active:scale-95 transition-all shadow-lg rounded-lg"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
      
      {/* Trigger Button - Disappears when open to prevent "double close" confusion */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Chat"
          className="group flex items-center justify-center w-16 h-16 bg-[var(--color-brand-primary)] shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 rounded-full"
        >
          <MessageSquare size={28} className="text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      )}
    </div>
  );
}
