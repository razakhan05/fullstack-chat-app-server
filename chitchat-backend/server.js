import express from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables from .env file
config();
const app = express();
connectDB();
//to accepts json data from frontend
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world ");
});

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5400;
app.listen(PORT, console.log(`Server is running on port ${PORT} `));
