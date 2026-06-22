'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Brain, Send, Loader2, Sparkles, Code, ShieldCheck, Bug, Lock, Network, ArrowLeft, Trash2, Plus, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

const quickPrompts = [
  { icon: ShieldCheck, text: 'Kiberxavfsizlikka qanday kirish mumkin?', color: 'cyan' },
  { icon: Bug, text: 'SQL injection nima va qanday himoyalanish mumkin?', color: 'yellow' },
  { icon: Lock, text: 'Parolni qanday xavfsiz saqlash kerak?', color: 'blue' },
  { icon: Network, text: 'TCP/IP 3-way handshake qanday ishlaydi?', color: 'cyan' },
  { icon: Code, text: 'Python bilan penetration testing qanday boshlanadi?', color: 'yellow' },
  { icon: Brain, text: 'Bug bounty hunter bo\'lish uchun nima qilish kerak?', color: 'blue' },
];

export default function AITeacherPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUser();
    fetchConversations();
  }, []);

  useEffect(() => {
    if (currentConvId) {
      fetchMessages(currentConvId);
    } else {
      setMessages([]);
    }
  }, [currentConvId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchUser = async () => {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    if (!data.user) {
      router.push('/login');
      return;
    }
    setUser(data.user);
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/ai/chat');
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/ai/chat?conversationId=${convId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || loading) return;

    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: messageText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          conversationId: currentConvId,
          history: messages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Xatolik yuz berdi');
        return;
      }

      const aiMsg: Message = {
        id: data.messageId,
        role: 'assistant',
        content: data.response,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setCurrentConvId(data.conversationId);
      fetchConversations();
    } catch (err) {
      toast.error('Tarmoq xatoligi');
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setCurrentConvId(null);
    setMessages([]);
  };

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-cyan-400" />
            <span className="text-lg font-bold gradient-text">CyberUz Academy</span>
          </Link>
          <Link href="/dashboard" className="text-sm hover:text-cyan-400">← Dashboard</Link>
        </div>
      </nav>

      <div className="pt-20 px-4 max-w-7xl mx-auto h-screen flex flex-col">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-2 rounded-full glass-card border-yellow-500/30">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Powered by Groq AI</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black">
            <span className="gradient-text">CyberAI</span> O'qituvchi
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 overflow-hidden pb-4">
          {/* Sidebar - Conversations */}
          <div className="glass-card p-4 flex flex-col overflow-hidden">
            <button
              onClick={startNewChat}
              className="neon-button text-sm mb-4 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Yangi Suhbat
            </button>

            <h3 className="text-sm font-bold mb-2 text-gray-400">Tarix</h3>
            <div className="flex-1 overflow-y-auto space-y-2">
              {conversations.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">Hozircha suhbatlar yo'q</p>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setCurrentConvId(conv.id)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition ${
                      currentConvId === conv.id
                        ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
                        : 'bg-cyber-black/50 hover:bg-cyber-black border border-transparent'
                    }`}
                  >
                    <MessageSquare className="w-3 h-3 inline mr-1" />
                    {conv.title.substring(0, 30)}{conv.title.length > 30 ? '...' : ''}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Main Chat */}
          <div className="md:col-span-3 glass-card flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-cyan-400 opacity-50" />
                  <h2 className="text-2xl font-bold mb-2 gradient-text">Salom! Men CyberAI</h2>
                  <p className="text-gray-400 mb-6">Kiberxavfsizlik bo'yicha savollaringizga javob beraman</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {quickPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(prompt.text)}
                        className={`text-left p-3 rounded-lg bg-cyber-dark border border-cyan-500/20 hover:border-cyan-500/50 transition group`}
                      >
                        <prompt.icon className={`w-5 h-5 text-${prompt.color}-400 mb-1`} />
                        <p className="text-sm">{prompt.text}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl p-4 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white'
                          : 'bg-cyber-dark text-gray-200 border border-cyan-500/20'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-cyan-500/20">
                          <Brain className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-bold text-cyan-400">CyberAI</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-cyber-dark border border-cyan-500/20 rounded-xl p-4 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span className="text-sm text-gray-400">CyberAI o'ylayapti...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-cyan-500/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Kiberxavfsizlik bo'yicha savol bering..."
                  className="input-field"
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="neon-button px-6 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                CyberAI kiberxavfsizlik ta'limi uchun maxsus yaratilgan. Ma'lumotlarni tekshirib oling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}