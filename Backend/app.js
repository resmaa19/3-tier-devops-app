const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Message = require("./models/Message");

const app = express();

app.use(cors());
app.use(express.json());

/* 🔗 MongoDB Connection */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

/* 🟢 CREATE - Add message */
app.post("/api/messages", async (req, res) => {
  try {
    const { text } = req.body;

    const newMessage = new Message({ text });
    await newMessage.save();

    res.json({
      success: true,
      message: "Message saved successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🟡 READ - Get all messages */
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🔵 Health Check */
app.get("/", (req, res) => {
  res.send("Backend with MongoDB is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});