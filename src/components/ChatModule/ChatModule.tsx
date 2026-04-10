import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, User, MessageSquare } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import useApiFetch from "../../hooks/useAPIFetch";
import ENVConfig from "../../config/config";
import styles from "./ChatModule.module.css";
import CircularLoader from "../CircularLoader/CircularLoader";
import ChatExpenseCard from "./ChatExpenseCard";
import InfiniteScroll from "react-infinite-scroll-component";

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
  groupName: string;
  onClose?: () => void;
}

const ChatModule: React.FC<ChatModuleProps> = ({ groupId, groupName }) => {
  const user = useSelector((state: RootState) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const [hasMore, setHasMore] = useState(true);
  const [lastReadId, setLastReadId] = useState<number>(0);
  const lastReadIdOnOpen = useRef<number | null>(null);
  const unreadDividerRef = useRef<HTMLDivElement>(null);
  const hasScrolledToUnread = useRef<boolean>(false);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const limit = 20;

  const { fetchData: fetchHistory, response: historyRes, isLoading } = useApiFetch(`/chat/history/${groupId}?limit=${limit}`);
  const { fetchData: fetchMore, response: moreRes, isLoading: isFetchingMore } = useApiFetch("");

  const loadMoreMessages = useCallback(async () => {
    if (isFetchingMore || !hasMore || messages.length === 0) return;
    const lastId = messages[messages.length - 1].chat_id;
    fetchMore(`/chat/history/${groupId}?limit=${limit}&lastId=${lastId}`);
  }, [messages, hasMore, isFetchingMore, groupId, fetchMore]);

  useEffect(() => {
    if (moreRes?.success === 1) {
      const moreMessages = moreRes.data;
      if (moreMessages.length < limit) setHasMore(false);
      setMessages((prev) => [...prev, ...moreMessages]);
    }
  }, [moreRes]);

  useEffect(() => {
    // Fetch chat history
    fetchHistory();

    // Initialize socket connection
    socketRef.current = io(ENVConfig.baseURL, {
      withCredentials: true,
    });

    socketRef.current.emit("join_group", groupId);

    socketRef.current.on("receive_message", (message: Message) => {
      setMessages((prev) => [message, ...prev]);
      // If tab is active, mark this new message as read immediately
      if (document.visibilityState === "visible") {
        markAsRead(message.chat_id);
      }
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
      const fetchedMessages = historyRes.data;
      setMessages(fetchedMessages);
      if (fetchedMessages.length < limit) setHasMore(false);

      // Set lastReadId from response
      const serverLastReadId = historyRes.lastReadId || 0;
      setLastReadId(serverLastReadId);

      // Only set the 'onOpen' anchor once for the session
      if (lastReadIdOnOpen.current === null && fetchedMessages.length > 0) {
        lastReadIdOnOpen.current = serverLastReadId;
      }

      // If messages arrived and we are looking at it, mark latest as read
      if (fetchedMessages.length > 0 && document.visibilityState === "visible") {
        markAsRead(fetchedMessages[0].chat_id);
      }
    }
  }, [historyRes]);

  const markAsRead = useCallback(
    (chatId: number) => {
      if (!socketRef.current || !chatId || chatId <= lastReadId) return;

      socketRef.current.emit("mark_read", {
        userId: user.id,
        groupId: groupId,
        lastChatId: chatId,
      });
      setLastReadId(chatId);
    },
    [user.id, groupId, lastReadId]
  );

  // Visibility API to mark as read when user returns to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && messages.length > 0) {
        markAsRead(messages[0].chat_id);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [messages, markAsRead]);

  // Auto-scroll to unread divider on first load
  useEffect(() => {
    if (!isLoading && messages.length > 0 && unreadDividerRef.current && !hasScrolledToUnread.current) {
      setTimeout(() => {
        unreadDividerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        hasScrolledToUnread.current = true;
      }, 300);
    }
  }, [isLoading, messages.length]);
  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" });
  };

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
      {/* Header section */}
      <div className={styles.chatHeader}>
        <div className={styles.headerInfo}>
          <div className={styles.groupAvatar}>{groupName?.charAt(0).toUpperCase() || "G"}</div>
          <div className={styles.groupTitle}>
            <h3>{groupName}</h3>
            <div className={styles.groupStatus}>
              <span className={styles.statusDot}></span>
              Online
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          {/* <button className={styles.iconBtn}>
            <Users size={18} />
          </button>
          <button className={styles.iconBtn}>
            <Info size={18} />
          </button> */}
        </div>
      </div>

      <div id="scrollableDiv" className={styles.messagesList}>
        {isLoading ? (
          <CircularLoader />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageSquare size={48} strokeWidth={1} />
            <p className="mt-2 text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={messages.length}
            next={loadMoreMessages}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center py-4">
                <CircularLoader />
              </div>
            }
            scrollableTarget="scrollableDiv"
            inverse={true}
            style={{ display: "flex", flexDirection: "column-reverse", gap: "8px", overflow: "visible" }}
          >
            {messages.map((msg, index, array) => {
              const isMe = String(msg.user_id) === String(user.id);
              const isLastMessageOfDate =
                index === array.length - 1 || new Date(array[index + 1].created_at).toDateString() !== new Date(msg.created_at).toDateString();

              return (
                <React.Fragment key={msg.chat_id || index}>
                  <div className={`${styles.messageWrapper} ${isMe ? styles.myMessage : ""}`}>
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
                            isMe={isMe}
                          />
                        )}
                        <span className={styles.timestamp}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Unread Messages Divider */}
                  {lastReadIdOnOpen.current !== null &&
                    !isMe &&
                    Number(msg.chat_id) > Number(lastReadIdOnOpen.current) &&
                    ((array[index + 1] && Number(array[index + 1].chat_id) <= Number(lastReadIdOnOpen.current)) ||
                      (!array[index + 1] && !hasMore)) && (
                      <div ref={unreadDividerRef} className={styles.unreadDivider}>
                        <span className={styles.unreadText}>Unread Messages</span>
                      </div>
                    )}
                  {isLastMessageOfDate && (
                    <div className={styles.dateDivider}>
                      <span className={styles.dateText}>{formatDateLabel(msg.created_at)}</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </InfiniteScroll>
        )}
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
