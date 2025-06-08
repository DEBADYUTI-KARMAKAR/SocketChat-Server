const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const cors = require('cors');
const userRoutes = require('./routes/user.route')
const chatRoutes = require("./routes/chat.route")
const messageRoutes = require("./routes/message.route");
const app = express();
dotenv.config()
app.use(cors());
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Api is running");
})

app.use('/api/users',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)



module.exports = app;