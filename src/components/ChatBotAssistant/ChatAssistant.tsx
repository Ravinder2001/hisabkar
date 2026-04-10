import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { X, Send, Bot, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useApiFetch from "../../hooks/useAPIFetch";
import { Input } from "../ui/input";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
  isNew?: boolean;
}

interface ChatAssistantProps {
  groupId: string;
  inStack?: boolean; // when true, button is inline inside a parent stack container
}

const TypewriterMessage = ({ text, isNew }: { text: string; isNew?: boolean }) => {
  const [displayedText, setDisplayedText] = useState(isNew ? "" : text);

  useEffect(() => {
    if (!isNew) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text, isNew]);

  return (
    <div className="markdown-content">
      <ReactMarkdown>{displayedText}</ReactMarkdown>
    </div>
  );
};

export default function ChatAssistant({ groupId, inStack = false }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { fetchData, response, isLoading } = useApiFetch("/chatbot/message/" + groupId);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (overrideInput?: string) => {
    const messageToSend = (overrideInput || input).trim();
    if (!messageToSend || isLoading) return;

    const userMsg: Message = { role: "user", parts: [{ text: messageToSend }] };
    setMessages((prev) => [...prev.map((m) => ({ ...m, isNew: false })), userMsg]);
    setInput("");

    await fetchData(undefined, {
      method: "POST",
      data: {
        message: messageToSend,
        history: messages.map(({ role, parts }) => ({ role, parts })),
      },
    });
  };

  useEffect(() => {
    if (response?.success === 1 && response?.data) {
      const modelMsg: Message = { role: "model", parts: [{ text: response.data.text }], isNew: true };
      setMessages((prev) => [...prev, modelMsg]);
    } else if (response?.success === 0 && response?.message) {
      const modelErrorMsg: Message = { role: "model", parts: [{ text: `**Error:** ${response.message}` }], isNew: true };
      setMessages((prev) => [...prev, modelErrorMsg]);
    }
  }, [response]);

  return (
    <>
      {/* Floating Button */}
      <Button
        className={`${
          inStack ? "" : "fixed bottom-24 right-6 "
        }rounded-full w-14 h-14 shadow-lg bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-0 flex items-center justify-center transform transition-transform hover:scale-110 active:scale-95 shadow-purple-500/20`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ zIndex: inStack ? undefined : 40 }}
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </Button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed z-[99999] shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-t-3xl md:rounded-3xl bg-white border border-slate-100 flex flex-col overflow-hidden bottom-[75px] md:bottom-[100px] right-0 md:right-6 w-full md:w-[350px] h-[calc(100vh-80px)] md:h-[550px] max-h-[calc(100vh-90px)] md:max-h-[70vh] max-w-[100vw]"
            style={{ bottom: "6px" }}
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
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* Custom scrollbar class simulation for Webkit */}
              <style>
                {`
                .scroll-smooth::-webkit-scrollbar { display: none; }
              `}
              </style>
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">How can I help you?</h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Ask me about group spending, your expenses, or just say hello!</p>
                  </div>

                  {/* Suggestions Chips */}
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {[
                      { label: "📊 Group Summary", prompt: "Give me a summary of this group's spending." },
                      { label: "📍 Category Analysis", prompt: "Where did I spend my money? Give me a breakdown by category." },
                      { label: "🔮 Prediction", prompt: "Predict our total spending for this month." },
                      { label: "💰 My Spendings", prompt: "How much have I added in this group?" },
                    ].map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(chip.prompt)}
                        className="text-[11px] bg-white border border-purple-100 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-50 hover:border-purple-200 transition-all font-medium shadow-sm"
                      >
                        {chip.label}
                      </button>
                    ))}
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
                    {msg.role === "model" ? <TypewriterMessage text={msg.parts[0].text} isNew={msg.isNew} /> : msg.parts[0].text}
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
                  onClick={() => handleSend()}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
