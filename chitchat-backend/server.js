import express from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// Load environment variables from .env file
config();

const app = express();
const PORT = process.env.PORT || 5400;

// Middleware to parse JSON data from frontend
app.use(express.json());

//Routes
app.get("/", (req, res) => {
  res.send("hello world ");
});
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

//Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to the database
connectDB();

app.listen(PORT, console.log(`Server is running on port ${PORT} `));
