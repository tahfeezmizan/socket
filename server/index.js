import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const port = 3000;

const expressServer = createServer(app);
const io = new Server(expressServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

io.on("connection", (socket) => {
  console.log(`User connected with id: ${socket.id}`);
  
  // Send welcome message to the newly connected user
  socket.emit("welcome", "Welcome to the chat server!");

  // Handle incoming messages
  socket.on("message", (msg) => {
    console.log("Message received:", msg);

    // Send message back to sender (echo)
    socket.emit("transfer-chat", msg);

    // If you want to broadcast to ALL users including sender:
    // io.emit("transfer-chat", msg);
    
    // If you want to broadcast to ALL users EXCEPT sender:
    // socket.broadcast.emit("transfer-chat", msg);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get("/", (req, res) => {
  res.send("Chat Socket Server");
});

expressServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});