import React, { useState, useEffect, useRef } from "react";
import { Send, User, MessageSquare } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import useApiFetch from "../../hooks/useAPIFetch";
import ENVConfig from "../../config/config";
import styles from "./ChatModule.module.css";
import CircularLoader from "../CircularLoader/CircularLoader";

interface Message {
  chat_id: number;
  group_id: number;
  user_id: number;
  message: string;
  user_name: string;
  created_at: string;
}

interface ChatModuleProps {
  groupId: string;
}

const ChatModule: React.FC<ChatModuleProps> = ({ groupId }) => {
  const user = useSelector((state: RootState) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
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
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

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

      <form onSubmit={handleSendMessage} className={styles.inputArea}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className={styles.input}
        />
        <button type="submit" disabled={!newMessage.trim()} className={styles.sendButton}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatModule;
