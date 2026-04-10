const { Server } = require("socket.io");
const chatModel = require("../model/chat.model");
const { decryptData, encryptData } = require("../utils/encryption");
const { sendNotificationsToUsers } = require("../helpers/pushService");

const initSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join a group room
    socket.on("join_group", async (data) => {
      try {
        const { groupId: encryptedGroupId, userId } = typeof data === "object" ? data : { groupId: data, userId: null };
        const groupId = await decryptData(encryptedGroupId);
        socket.join(`group_${groupId}`);
        if (userId) {
          socket.userId = userId.toString();
        }
        console.log(`Socket ${socket.id} (User: ${socket.userId}) joined group_${groupId}`);
      } catch (error) {
        console.error("Socket join_group error:", error.message);
      }
    });

    // Leave a group room
    socket.on("leave_group", async (data) => {
      try {
        const { groupId: encryptedGroupId } = typeof data === "object" ? data : { groupId: data };
        const groupId = await decryptData(encryptedGroupId);
        socket.leave(`group_${groupId}`);
        console.log(`Socket ${socket.id} left group_${groupId}`);
      } catch (error) {
        console.error("Socket leave_group error:", error.message);
      }
    });

    // Handle sending a message
    socket.on("send_message", async (data) => {
      const { groupId: encryptedGroupId, userId, message, expenseId } = data;
      try {
        if (!message || message.trim().length === 0 || message.length > 500) {
          return;
        }

        const groupId = await decryptData(encryptedGroupId);
        // Save message using model
        const newMessage = await chatModel.saveMessage({
          groupId,
          userId,
          message,
          expenseId,
        });

        if (newMessage) {
          // Auto-mark as read for the sender
          await chatModel.updateReadStatus(userId, groupId, newMessage.chat_id);
          // Broadcast to the room
          const roomName = `group_${groupId}`;
          io.to(roomName).emit("receive_message", newMessage);

          // ── Push Notifications ──
          try {
            // Get all userIds currently in this socket room
            const socketsInRoom = await io.in(roomName).fetchSockets();
            const activeUserIdsInRoom = new Set(socketsInRoom.filter((s) => s.userId).map((s) => s.userId.toString()));

            const subscribers = await chatModel.getNotificationData(groupId, userId);
            const encryptedId = encryptData(groupId.toString());

            const notificationPayload = {
              title: `${subscribers[0]?.group_name || "New Message"}`,
              body: `${newMessage.user_name}: ${newMessage.message}`,
              group_id: encryptedId,
            };

            subscribers.forEach((sub) => {
              // Only send if the user is NOT actively in the chat room
              if (!activeUserIdsInRoom.has(sub.user_id?.toString())) {
                const subscription = {
                  endpoint: sub.endpoint,
                  keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth,
                  },
                };
                sendNotificationsToUsers(subscription, notificationPayload);
              }
            });
          } catch (pushError) {
            console.error("Error triggering push notifications:", pushError);
          }
        }
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle marking messages as read
    socket.on("mark_read", async (data) => {
      try {
        const { userId, groupId: encryptedGroupId, lastChatId } = data;
        const groupId = await decryptData(encryptedGroupId);
        if (userId && groupId && lastChatId) {
          await chatModel.updateReadStatus(userId, groupId, lastChatId);
        }
      } catch (error) {
        console.error("Socket mark_read error:", error);
      }
    });

    // Handle typing events
    socket.on("typing", async (data) => {
      const { groupId: encryptedGroupId, userName } = data;
      try {
        const groupId = await decryptData(encryptedGroupId);
        socket.to(`group_${groupId}`).emit("user_typing", { userName });
      } catch (error) {
        console.error("Socket typing error:", error.message);
      }
    });

    socket.on("stop_typing", async (data) => {
      const { groupId: encryptedGroupId, userName } = data;
      try {
        const groupId = await decryptData(encryptedGroupId);
        socket.to(`group_${groupId}`).emit("user_stop_typing", { userName });
      } catch (error) {
        console.error("Socket stop_typing error:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initSockets;
