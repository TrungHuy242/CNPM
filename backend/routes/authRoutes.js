// router.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', (req, res) => {
    console.log("Đã nhận yêu cầu đăng ký");
    registerUser(req, res);
});

router.post('/login', loginUser);

module.exports = router;
