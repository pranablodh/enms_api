const express  = require('express');
const router   = express.Router();
const userSelf = require('../database/userSelf');
const otp      = require('../database/otpVerification');

router.post('/registration', userSelf.newUser, otp.sendOTP);

module.exports = 
{
    router
}