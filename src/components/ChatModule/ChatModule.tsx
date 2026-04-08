import React, { useState, useEffect, useRef } from "react";
import { Send, User, MessageSquare } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import useApiFetch from "../../hooks/useAPIFetch";
import ENVConfig from "../../config/config";
import styles from "./ChatModule.module.css";
import CircularLoader from "../CircularLoader/CircularLoader";
import ChatExpenseCard from "./ChatExpenseCard";

interface Message {
  chat_id: number;
  group_id: number;
  user_id: number;
  message: string;
  user_name: string;
  created_at: string;
  expense_id?: number;
  expense_name?: string;
  expense_amount?: string;
  expense_date?: string;
  expense_icon?: string;
  expense_type?: string;
  expense_members?: Array<{
    name: string;
    amount: number;
    avatar: string;
  }>;
}

interface ChatModuleProps {
  groupId: string;
}

const ChatModule: React.FC<ChatModuleProps> = ({ groupId }) => {
  const user = useSelector((state: RootState) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { fetchData: fetchHistory, response: historyRes, isLoading } = useApiFetch(`/chat/history/${groupId}`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Fetch chat history
    fetchHistory();

    // Initialize socket connection
    socketRef.current = io(ENVConfig.baseURL, {
      withCredentials: true,
    });

    socketRef.current.emit("join_group", groupId);

    socketRef.current.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on("user_typing", ({ userName }: { userName: string }) => {
      setTypingUsers((prev) => (prev.includes(userName) ? prev : [...prev, userName]));
    });

    socketRef.current.on("user_stop_typing", ({ userName }: { userName: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== userName));
    });

    return () => {
      socketRef.current?.emit("leave_group", groupId);
      socketRef.current?.disconnect();
    };
  }, [groupId, fetchHistory]);

  useEffect(() => {
    if (historyRes?.success === 1) {
      setMessages(historyRes.data);
    }
  }, [historyRes]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!socketRef.current) return;
    const firstName = user.name.split(" ")[0];

    // Emit typing event
    socketRef.current.emit("typing", { groupId, userName: firstName });

    // Clear existing timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("stop_typing", { groupId, userName: firstName });
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;
    const firstName = user.name.split(" ")[0];

    // Stop typing immediately when sending
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketRef.current.emit("stop_typing", { groupId, userName: firstName });

    const messageData = {
      groupId,
      userId: user.id,
      message: newMessage.trim(),
    };

    socketRef.current.emit("send_message", messageData);
    setNewMessage("");
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <MessageSquare size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold ml-2">Group Chat</h3>
      </div>

      <div className={styles.messagesList}>
        {isLoading ? (
          <CircularLoader />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageSquare size={48} strokeWidth={1} />
            <p className="mt-2 text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = String(msg.user_id) === String(user.id);
            return (
              <div key={msg.chat_id || index} className={`${styles.messageWrapper} ${isMe ? styles.myMessage : ""}`}>
                {!isMe && (
                  <div className={styles.avatar}>
                    <User size={14} />
                  </div>
                )}
                <div className={styles.messageContent}>
                  {!isMe && <span className={styles.userName}>{msg.user_name}</span>}
                  <div className={styles.bubble}>
                    <p>{msg.message}</p>
                    {msg.expense_id && (
                      <ChatExpenseCard
                        name={msg.expense_name || "Expense"}
                        amount={Number(msg.expense_amount) || 0}
                        date={msg.expense_date || msg.created_at}
                        icon={msg.expense_icon || ""}
                        category={msg.expense_type || ""}
                        members={msg.expense_members || []}
                      />
                    )}
                    <span className={styles.timestamp}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {typingUsers.length > 0 && (
        <div className={styles.typingIndicator}>
          <span className={styles.typingText}>
            {typingUsers.length === 1
              ? `${typingUsers[0]} is typing...`
              : typingUsers.length === 2
                ? `${typingUsers[0]} and ${typingUsers[1]} are typing...`
                : "Several people are typing..."}
          </span>
        </div>
      )}

      <form onSubmit={handleSendMessage} className={styles.inputArea}>
        <input type="text" value={newMessage} onChange={handleInputChange} placeholder="Type a message..." className={styles.input} />
        <button type="submit" disabled={!newMessage.trim()} className={styles.sendButton}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatModule;
