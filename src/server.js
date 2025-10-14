const dotenv = require("dotenv");
const connectDB = require("./db/index");
const app = require("./app")
dotenv.config()
const PORT = process.env.PORT || 3000;
connectDB()

let server=app.listen(PORT,()=>{
    console.log("Running on",PORT);
    
})
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});


io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // 1. Setup user
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.userId = userData._id;
    socket.emit("connected");
  });

  
  // 2. Join a specific chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined chat room: ${room}`);
  });

  // 3. Typing indicators
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // 4. Send and forward new message
  socket.on("new message", (newMessage) => {
    const chat = newMessage.chat;
    if (!chat?.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
  });

  // 5. Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
    if (socket.userId) socket.leave(socket.userId);
  });
});
