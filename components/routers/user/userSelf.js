const express               = require('express');
const router                = express.Router();
const userRegistration      = require('../../database/user/userRegistration');
const otpFetch              = require('../../database/otp/otpFetch');
const emailOtp              = require('../../otp/emailOTP');

router.post('/registration', userRegistration.newUser, otpFetch.fetchOtp, emailOtp.sendOTP);

module.exports = 
{
    router
}