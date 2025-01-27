const express = require('express');
const router = express.Router();
const { register, login ,forgotPassword,resetPassword ,verifyEmail} = require('../controllers/authController');

router.post('/register', register);
router.post('/verifyUser', verifyEmail);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPass', resetPassword);




module.exports = router;
