import express from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Load environment variables from .env file
config();

const app = express();
const server = http.createServer(app); // Create an HTTP server for Socket.io
const PORT = process.env.PORT || 5400;

// Middleware to parse JSON data from frontend
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to the database
connectDB();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join-chat", (room) => {
    socket.join(room);
    console.log(room, "User joined the room");
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop-typing", (room) => socket.in(room).emit("stop-typing"));

  socket.on("new-message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    console.log(chat)

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message-recieved", newMessageRecieved);
    });
  });
});
