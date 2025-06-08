const express = require('express');
const { registerUser, loginUser,allUsers } = require('../controllers/user.controller');
const verifyJWT = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/').post(registerUser).get(verifyJWT,allUsers);
router.post('/login', loginUser);

module.exports = router;
