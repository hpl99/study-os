"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Bot, X, Send, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateAIChatResponse } from "@/services/ai/gemini";
import ReactMarkdown from "react-markdown";

export function AIChatModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: "Hello! I am your StudyOS AI coach. How can I help you plan your roadmap or understand a topic today?" }
  ]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isPending) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    startTransition(async () => {
      // Create context from previous messages
      const context = messages.map(m => `${m.role === 'ai' ? 'Coach' : 'User'}: ${m.content}`).join('\n');
      
      const response = await generateAIChatResponse(userMessage, context);
      setMessages((prev) => [...prev, { role: "ai", content: response }]);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full sm:w-[500px] h-[600px] max-h-[90vh] bg-black/90 border border-white/10 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">StudyOS AI Coach</h3>
              <p className="text-xs text-muted-foreground">Powered by Gemini</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-white/10" : "bg-primary/20"
              }`}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-white/10 text-white"
              }`}>
                <div className="prose prose-invert prose-sm prose-p:leading-relaxed max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isPending && (
            <div className="flex gap-3 flex-row">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white/10 text-white flex flex-col gap-1">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your studies..."
              className="bg-black/50 border-white/10 focus-visible:ring-primary/50"
              disabled={isPending}
            />
            <Button type="submit" disabled={!input.trim() || isPending} size="icon" className="shrink-0 bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)]">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
