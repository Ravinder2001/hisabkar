import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Send, Sparkles } from "lucide-react";
import useApiFetch from "../../hooks/useAPIFetch";
import { Input } from "../ui/input";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  isNew?: boolean;
}

interface ChatAssistantProps {
  groupId: string;
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

export default function ChatAssistant({ groupId }: ChatAssistantProps) {
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

    const userMsg: Message = { role: "user", content: messageToSend };
    setMessages((prev) => [...prev.map((m) => ({ ...m, isNew: false })), userMsg]);
    setInput("");

    await fetchData(undefined, {
      method: "POST",
      data: {
        message: messageToSend,
        history: messages.map(({ role, content }) => ({ role, content })),
      },
    });
  };

  useEffect(() => {
    if (response?.success === 1 && response?.data) {
      const assistantMsg: Message = { role: "assistant", content: response.data.text, isNew: true };
      setMessages((prev) => [...prev, assistantMsg]);
    } else if (response?.success === 0 && response?.message) {
      const assistantErrorMsg: Message = { role: "assistant", content: `**Error:** ${response.message}`, isNew: true };
      setMessages((prev) => [...prev, assistantErrorMsg]);
    }
  }, [response]);

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--hk-bg)" }}>
      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`.scroll-smooth::-webkit-scrollbar { display: none; }`}</style>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "var(--hk-accent-soft)" }}>
              <Sparkles className="w-8 h-8" style={{ color: "var(--hk-accent-strong)" }} />
            </div>
            <div>
              <h5 className="font-bold text-sm" style={{ color: "var(--hk-ink)" }}>
                How can I help you?
              </h5>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--hk-ink-faint)" }}>
                Ask me about group spending, your expenses, or just say hello!
              </p>
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
                  className="text-[11px] px-3 py-1.5 rounded-full transition-all font-medium"
                  style={{ background: "var(--hk-surface)", border: "1px solid var(--hk-border)", color: "var(--hk-accent-strong)" }}
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
              className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === "user" ? "rounded-tr-none" : "rounded-tl-none"}`}
              style={
                msg.role === "user"
                  ? { background: "var(--hk-accent)", color: "var(--hk-on-accent)" }
                  : { background: "var(--hk-surface)", color: "var(--hk-ink)", border: "1px solid var(--hk-border)" }
              }
            >
              {msg.role === "assistant" ? <TypewriterMessage text={msg.content} isNew={msg.isNew} /> : msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-2xl rounded-tl-none flex gap-1" style={{ background: "var(--hk-surface)", border: "1px solid var(--hk-border)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "var(--hk-accent-strong)", animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "var(--hk-accent-strong)", animationDelay: "200ms" }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "var(--hk-accent-strong)", animationDelay: "400ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 flex-shrink-0" style={{ background: "var(--hk-surface)", borderTop: "1px solid var(--hk-border)" }}>
        <div
          className="flex gap-2 items-center p-1.5 rounded-2xl transition-all"
          style={{ background: "var(--hk-surface-2)", border: "1px solid var(--hk-border)" }}
        >
          <Input
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="border-none bg-transparent shadow-none focus-visible:ring-0 h-9"
            style={{ color: "var(--hk-ink)" }}
          />
          <Button
            size="icon"
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="rounded-xl w-9 h-9 flex-shrink-0"
            style={{ background: "var(--hk-accent)", color: "var(--hk-on-accent)" }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {response?.data?.remainingMessages !== undefined && (
          <p className="text-[10px] text-center mt-2 font-medium italic" style={{ color: "var(--hk-ink-faint)" }}>
            {response.data.remainingMessages > 0 ? `${response.data.remainingMessages} messages left today` : "Daily limit reached"}
          </p>
        )}
      </div>
    </div>
  );
}
