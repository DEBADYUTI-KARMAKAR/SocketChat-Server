const dotenv = require("dotenv");
const connectDB = require("./db/index");
const app = require("./app");
const { initSocket } = require("./socket/index");

dotenv.config();
const PORT = process.env.PORT || 3000;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Init socket and attach to global
const io = initSocket(server);
global.io = io;