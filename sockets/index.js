const { Server } = require("socket.io");
const client = require("../configuration/db");
const { decryptData } = require("../utils/encryption");

const initSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:8877",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join a group room
    socket.on("join_group", async (encryptedGroupId) => {
      const groupId = await decryptData(encryptedGroupId);
      socket.join(`group_${groupId}`);
      console.log(`Socket ${socket.id} joined group_${groupId}`);
    });

    // Leave a group room
    socket.on("leave_group", async (encryptedGroupId) => {
      const groupId = await decryptData(encryptedGroupId);
      socket.leave(`group_${groupId}`);
      console.log(`Socket ${socket.id} left group_${groupId}`);
    });

    // Handle sending a message
    socket.on("send_message", async (data) => {
      const { groupId: encryptedGroupId, userId, message, expenseId } = data;
      try {
        const groupId = await decryptData(encryptedGroupId);
        // Save message to database
        const query = `
          INSERT INTO tbl_chats (group_id, user_id, message, expense_id)
          VALUES ($1, $2, $3, $4)
          RETURNING *;
        `;
        const values = [groupId, userId, message, expenseId || null];
        const res = await client.query(query, values);

        if (res.rows.length > 0) {
          const newMessage = res.rows[0];
          // Fetch user details for the message
          const userRes = await client.query("SELECT name FROM tbl_users WHERE user_id = $1", [userId]);
          newMessage.user_name = userRes.rows[0]?.name || "Unknown";

          // Broadcast to the room
          io.to(`group_${groupId}`).emit("receive_message", newMessage);
        }
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initSockets;
