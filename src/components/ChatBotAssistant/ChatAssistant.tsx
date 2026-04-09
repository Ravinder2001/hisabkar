import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { X, Send, Bot, Sparkles } from "lucide-react";
import useApiFetch from "../../hooks/useAPIFetch";
import { Input } from "../ui/input";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

interface ChatAssistantProps {
  groupId: string;
}

export default function ChatAssistant({ groupId }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { fetchData, response, isLoading } = useApiFetch("/chatbot/message/" + groupId);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");

    await fetchData(undefined, {
      method: "POST",
      data: {
        message: currentInput,
        history: messages,
      },
    });
  };

  useEffect(() => {
    if (response?.success === 1 && response?.data) {
      const modelMsg: Message = { role: "model", parts: [{ text: response.data.text }] };
      setMessages((prev) => [...prev, modelMsg]);
    }
  }, [response]);

  return (
    <>
      {/* Floating Button */}
      <Button
        className="fixed bottom-24 right-6 rounded-full w-14 h-14 shadow-lg bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-0 flex items-center justify-center transform transition-transform hover:scale-110 active:scale-95 shadow-purple-500/20"
        onClick={() => setIsOpen(!isOpen)}
        style={{ zIndex: 99997 }}
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </Button>

      {/* Chat Popup */}
      {isOpen && (
        <div
          className="fixed bottom-40 right-6 w-[350px] h-[500px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] rounded-3xl bg-white border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10"
          style={{ zIndex: 99999 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">Gemini Assistant</h4>
                <p className="text-[10px] text-purple-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online & Ready
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">How can I help you?</h5>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Ask me about group spending, your expenses, or just say hello!</p>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white rounded-tr-none"
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                  }`}
                >
                  {msg.parts[0].text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "200ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "400ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2 items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner focus-within:border-purple-300 transition-all">
              <Input
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="border-none bg-transparent shadow-none focus-visible:ring-0 h-9 placeholder:text-slate-400"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white w-9 h-9 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {response?.data?.remainingMessages !== undefined && (
              <p className="text-[10px] text-slate-400 text-center mt-2 font-medium italic">
                {response.data.remainingMessages > 0 ? `${response.data.remainingMessages} messages left today` : "Daily limit reached"}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
