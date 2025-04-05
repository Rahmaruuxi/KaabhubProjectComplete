const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const mentorshipRoutes = require("./routes/mentorshipRoutes");
const mentorshipMessageRoutes = require("./routes/mentorshipMessageRoutes");
const postRoutes = require("./routes/postRoutes");
const scholarshipRoutes = require("./routes/scholarshipRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/student-forum")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/mentorships", mentorshipRoutes);
app.use("/api/mentorship-messages", mentorshipMessageRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Student Forum API" });
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  // Join questions room
  socket.on("join-questions", () => {
    socket.join("questions");
    console.log("Client joined questions room");
  });

  // Leave questions room
  socket.on("leave-questions", () => {
    socket.leave("questions");
    console.log("Client left questions room");
  });

  // Join question room
  socket.on("join-question", (questionId) => {
    socket.join(`question-${questionId}`);
    console.log(`Client joined question room: ${questionId}`);
  });

  // Leave question room
  socket.on("leave-question", (questionId) => {
    socket.leave(`question-${questionId}`);
    console.log(`Client left question room: ${questionId}`);
  });

  // Join mentorship room
  socket.on("join-mentorship", (mentorshipId) => {
    socket.join(`mentorship-${mentorshipId}`);
    console.log(`Client joined mentorship room: ${mentorshipId}`);
  });

  // Leave mentorship room
  socket.on("leave-mentorship", (mentorshipId) => {
    socket.leave(`mentorship-${mentorshipId}`);
    console.log(`Client left mentorship room: ${mentorshipId}`);
  });

  // Handle real-time notifications
  socket.on("join", (userId) => {
    console.log(`User ${userId} joined their notification room`);
    socket.join(userId);
  });

  socket.on("leave", (userId) => {
    console.log(`User ${userId} left their notification room`);
    socket.leave(userId);
  });

  // Chat-specific socket events
  socket.on("join-chat", (chatId) => {
    socket.join(`chat-${chatId}`);
  });

  socket.on("leave-chat", (chatId) => {
    socket.leave(`chat-${chatId}`);
  });

  socket.on("new-message", (data) => {
    io.to(`chat-${data.chatId}`).emit("message-received", data);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
