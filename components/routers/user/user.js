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
const tokenStore             = require('../../database/user/sessionTokenStore');
const logout                 = require('../../database/user/logout');
const auth                   = require('../../middleware/auth');

router.post('/registration', userRegistration.newUser, otpFetch.fetchOtp, emailOtp.sendOTP);
router.post('/verifyEmail', auth.authentication, verifyEmail.verifyEmail);
router.post('/verifyMobile', auth.authentication, verifyMobile.verifyMobile);
router.get('/resendEmailOtp', auth.authentication, otpFetch.fetchOtp, emailOtp.sendOTP);
router.post('/updateMobile', auth.authentication, updateMobile.changeMobile);
router.post('/updateEmail', auth.authentication, updateEmail.changeEmail);
router.get('/login', login.login, tokenStore.tokenStore);
router.get('/logout', auth.authentication, logout.logout);


module.exports = 
{
    router
}