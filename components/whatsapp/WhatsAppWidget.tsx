'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, RotateCcw, Bot, User, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
  time: string;
  products?: any[]; // Dynamic products from bot
};

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'bot',
  content: 'Hi! I am the Satya Computers Assistant. How can I help you with bulk laptop requirements or support today?',
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setMessages([INITIAL_MESSAGE]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMsg].map(m => ({ 
            role: m.role === 'user' ? 'user' : 'assistant', 
            content: m.content 
          })) 
        })
      });

      const data = await response.json();
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: data.text || "I'm sorry, I'm having trouble connecting right now. Please try again or contact us via WhatsApp.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        products: data.products || [] // <-- Add this
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
       console.error("Chat Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  function resetChat() {
    setMessages([INITIAL_MESSAGE]);
    setInput('');
    setIsTyping(false);
  }

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[90vw] sm:w-[380px] h-[600px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-black/5 flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="bg-black text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--color-brand-primary)] rounded-full flex items-center justify-center text-white shadow-lg shadow-[var(--color-brand-primary)]/20 animate-pulse">
                   <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-heading text-sm tracking-widest uppercase font-black">SATYA ASSISTANT</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] text-white/50 font-bold tracking-widest uppercase">Online Now</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => resetChat()}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                  title="Refresh Conversation"
                >
                   <RotateCcw size={18} />
                </button>
                <button 
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50"
            >
              {messages.map((m) => (
                <div 
                  key={m.id}
                  className={cn(
                    "flex flex-col max-w-[95%]",
                    m.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  {/* Message Bubble */}
                  <div className={cn(
                    "p-4 rounded-2xl text-[13px] leading-relaxed font-body shadow-sm whitespace-pre-wrap relative",
                    m.role === 'user' 
                      ? "bg-black text-white rounded-tr-none" 
                      : "bg-white text-black/80 border border-black/5 rounded-tl-none font-medium"
                  )}>
                    {m.content}

                    {/* Bot-only Action Buttons */}
                    {m.role === 'bot' && (
                      <div className="mt-4 pt-4 border-t border-black/5 flex flex-wrap gap-2">
                         <a 
                           href={`https://wa.me/919640272323?text=Hi, I am interested in ${encodeURIComponent(m.content.substring(0, 50))}...`}
                           target="_blank"
                           rel="noopener noreferrer"
                           title="Chat on WhatsApp"
                           className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-sm"
                         >
                           <MessageSquare size={12} /> WhatsApp
                         </a>
                         <a 
                           href="tel:+919640272323"
                           title="Call our Sales Team"
                           className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-sm"
                         >
                           <MessageSquare size={12} className="rotate-90" /> Call Sales
                         </a>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Product Micro-Cards */}
                  {m.role === 'bot' && <ProductCards content={m.content} products={m.products} />}

                  <span className="text-[9px] text-black/20 mt-1.5 font-bold uppercase tracking-widest px-2">{m.time}</span>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-center gap-2 text-black/20 p-2">
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
                </div>
              )}
            </div>

            {/* Quick Replies */}
            {messages.length < 3 && !isTyping && (
              <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto">
                <button 
                  onClick={() => handleSend("Tell me about bulk pricing")}
                  className="whitespace-nowrap px-4 py-1.5 bg-white border border-black/10 rounded-full text-[10px] font-heading tracking-widest hover:border-black transition-all flex items-center gap-1.5 uppercase font-bold"
                >
                  Bulk Pricing <ChevronRight size={10} />
                </button>
                <button 
                  onClick={() => handleSend("Do you deliver across India?")}
                  className="whitespace-nowrap px-4 py-1.5 bg-white border border-black/10 rounded-full text-[10px] font-heading tracking-widest hover:border-black transition-all flex items-center gap-1.5 uppercase font-bold"
                >
                  Pan India <ChevronRight size={10} />
                </button>
              </div>
            )}

            {/* Input Form */}
            <div className="p-4 border-t border-black/5 bg-white pointer-events-auto">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 bg-gray-100 rounded-2xl p-2 pl-4 border border-black/5"
              >
                <input 
                  type="text"
                  placeholder="Ask about bulk laptops..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-xs font-medium text-black placeholder:text-black/30"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-xl transition-all",
                    input.trim() ? "bg-black text-white shadow-lg" : "bg-gray-200 text-black/20"
                  )}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setOpen(!open)}
        className="w-16 h-16 bg-black text-white rounded-full shadow-2xl shadow-black/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group pointer-events-auto relative z-50 overflow-hidden"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-brand-primary)] to-transparent opacity-30 group-hover:opacity-50 transition-opacity" />
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {!open && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white px-4 py-2 rounded-xl shadow-lg border border-black/5 mr-2 pointer-events-auto"
        >
          <span className="text-[10px] font-heading font-black tracking-widest uppercase text-black italic">
            SATYA_AI ONLINE
          </span>
        </motion.div>
      )}
    </div>
  );
}

function ProductCards({ content, products }: { content: string, products?: any[] }) {
  // Use API resolved products OR fallback to keyword search
  const displayProducts = (products && products.length > 0) ? products : [];
  
  // If no products from API, we can still try to match common search terms if we want, 
  // but better to rely on API now.

  if (displayProducts.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mt-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <p className="text-[9px] font-black uppercase text-black/30 tracking-[0.2em] px-2 flex items-center gap-2">
        <span className="w-4 h-[1px] bg-black/10" /> Recommended Products
      </p>
      {displayProducts.map((p, idx) => (
        <motion.div 
          key={p.id + idx}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: idx * 0.1, type: 'spring', damping: 15 }}
          className="bg-white border border-black/5 p-3 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-xl hover:border-black/15 transition-all duration-300 group overflow-hidden relative"
        >
           <div className="flex items-center gap-4 flex-1 min-w-0">
             <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-black/5 transition-transform group-hover:scale-110 duration-500 relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase text-black leading-tight mb-1 group-hover:text-[var(--color-brand-primary)] transition-colors truncate">{p.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-emerald-600 font-black tracking-tight">{p.price}</p>
                  {p.shortSpecs && <span className="text-[9px] text-black/30 font-medium">· {p.shortSpecs}</span>}
                </div>
             </div>
           </div>
           <a 
             href={p.link} 
             title={`View ${p.name}`}
             className="w-10 h-10 rounded-xl bg-gray-50 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm active:scale-90 ml-3 flex-shrink-0"
           >
              <ChevronRight size={18} />
           </a>
        </motion.div>
      ))}
    </div>
  );
}
