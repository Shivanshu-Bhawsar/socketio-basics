const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const dbConnect = require("./config/database");
const PORT = process.env.PORT || 5000;

const app = express();
// Create HTTP server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"], // Add all allowed origins here
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// importing routes
const seatRoutes = require("./routes/seatRoute")(io);

// middleware setup
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Add all allowed origins here
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials (if using with cookies/sessions)
  })
);
app.use(express.json());
app.use(cookieParser());

// connections
dbConnect();

// route handlers
app.use("/api/v1/seat", seatRoutes);

// default route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Your server is up and running....",
  });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // // Listen for seat selection
  // socket.on("seatsBooked", (seatIds) => {
  //   // Broadcast the updated seat status to all users
  //   io.emit("seatsUpdated", seatIds);
  // });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
