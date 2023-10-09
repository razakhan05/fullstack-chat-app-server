const express = require("express");
const { chats } = require("./data/data.js");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");

dotenv.config(); // Load environment variables from .env file

const app = express();
connectDB();

app.get("/", (req, res) => {
  res.send("hello world ");
});

//getting all the chats data
app.get("/api/chat", (req, res) => {
  res.send(chats);
});

//single chat data
app.get("/api/chat/:id", (req, res) => {
  console.log(req.params.id);
  const singleChatData = chats.find((c) => c._id === req.params.id);
  res.send(singleChatData);
});

const PORT = process.env.PORT || 5400;
app.listen(PORT, console.log(`Server is running on port ${PORT} `));
