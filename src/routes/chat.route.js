const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require("../controllers/chat.controller");
const verifyJWT = require("../middleware/auth.middleware");
// const Chat = require("../models/chatModel")
const express = require("express");

const router = express.Router();

router.route("/").post(verifyJWT,accessChat)
router.route("/").get(verifyJWT,fetchChats)
router.route("/group").post(verifyJWT,createGroupChat)
router.route("/rename").put(verifyJWT,renameGroup)
router.route("/groupremove").put(verifyJWT,removeFromGroup)
router.route("/groupadd").put(verifyJWT,addToGroup)

module.exports = router;