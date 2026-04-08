const { Server } = require("socket.io");
const chatModel = require("../model/chat.model");
const { decryptData } = require("../utils/encryption");

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
    socket.on("join_group", async (encryptedGroupId) => {
      try {
        const groupId = await decryptData(encryptedGroupId);
        socket.join(`group_${groupId}`);
        console.log(`Socket ${socket.id} joined group_${groupId}`);
      } catch (error) {
        console.error("Socket join_group error:", error.message);
      }
    });

    // Leave a group room
    socket.on("leave_group", async (encryptedGroupId) => {
      try {
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
          io.to(`group_${groupId}`).emit("receive_message", newMessage);
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
