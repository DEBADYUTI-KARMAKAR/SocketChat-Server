const express = require("express");
const verifyJWT = require("../middleware/auth.middleware");
const { sendMessage, allMessages } = require("../controllers/message.controller");
const router = express.Router();


router.route("/:chatId").get(verifyJWT,allMessages)
router.route("/").post(verifyJWT,sendMessage)

module.exports = router;