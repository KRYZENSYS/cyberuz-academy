'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Shield, Send, Loader2, Brain, Sparkles, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AITeacherPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          conversationId,
          history: messages.slice(-10),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setConversationId(data.conversationId);
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        toast.error(data.error || 'AI xatoligi');
      }
    } catch {
      toast.error('Tarmoq xatoligi');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  const quickPrompts = [
    'SQL Injection nima?',
    'XSS zaifligini tushuntir',
    'Linux command line asoslari',
    'Bug bounty qanday boshlash kerak?',
    'Penetration testing usullari',
    'Network security asoslari',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-cyan-400" />
            <span className="text-lg font-bold gradient-text">CyberUz Academy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm hover:text-cyan-400">Dashboard</Link>
            <Link href="/ai-teacher" className="text-sm font-bold text-cyan-400">🤖 AI Ustoz</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-4 px-4 max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="text-center mb-6 fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 mb-3 glow-cyan">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            <span className="gradient-text">CyberAI</span> O'qituvchi
          </h1>
          <p className="text-gray-400 text-sm">Kiberxavfsizlik bo'yicha istalgan savolni bering</p>
        </div>

        {messages.length === 0 ? (
          <div className="cyber-card p-6 mb-4 fade-in">
            <h3 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Tezkor savollar:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => setInput(p)}
                  className="text-left p-3 rounded-lg bg-cyber-black/50 hover:bg-cyber-black border border-cyan-500/20 hover:border-cyan-500/50 transition text-sm text-gray-300"
                >
                  💡 {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div ref={scrollRef} className="flex-1 overflow-y-auto cyber-card p-4 mb-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white'
                      : 'bg-cyber-black/70 border border-cyan-500/30 text-gray-100'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 text-cyan-400 text-xs">
                      <Brain className="w-3 h-3" /> CyberAI
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-cyber-black/70 border border-cyan-500/30 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-sm text-gray-400">CyberAI o'ylayapti...</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="cyber-card p-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Savol bering... (masalan: SQL Injection nima?)"
            disabled={loading}
            className="cyber-input flex-1"
          />
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
              title="Chatni tozalash"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="btn-neon px-6 flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Yuborish
          </button>
        </div>
      </div>
    </div>
  );
}