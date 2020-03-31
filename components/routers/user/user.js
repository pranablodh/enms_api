const express                = require('express');
const router                 = express.Router();
const userRegistration       = require('../../database/user/registration');
const otpFetch               = require('../../database/otp/otpFetch');
const emailOtp               = require('../../otp/emailOTP');
const verifyEmail            = require('../../database/user/emailVerification');
const verifyMobile           = require('../../database/user/mobileVerification');
const updateMobile           = require('../../database/user/changeMobile');
const updateEmail            = require('../../database/user/changeEmail');
const login                  = require('../../database/user/login');

router.post('/registration', userRegistration.newUser, otpFetch.fetchOtp, emailOtp.sendOTP);
router.post('/verifyEmail', verifyEmail.verifyEmail);
router.post('/verifyMobile', verifyMobile.verifyMobile);
router.get('/resendEmailOtp', otpFetch.fetchOtp, emailOtp.sendOTP);
router.post('/updateMobile', updateMobile.changeMobile);
router.post('/updateEmail', updateEmail.changeEmail);
router.get('/login', login.login);

module.exports = 
{
    router
}