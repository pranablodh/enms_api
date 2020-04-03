const express                = require('express');
const router                 = express.Router();
const userRegistration       = require('../../database/user/registration');
const otpFetch               = require('../../database/otp/otpFetch');
const emailOtp               = require('../../otp/emailOTP');
const verifyEmail            = require('../../database/user/emailVerification');
const verifyMobile           = require('../../database/user/mobileVerification');
const updateMobile           = require('../../database/user/changeMobileReg');
const updateEmail            = require('../../database/user/changeEmailReg');
const sessionRestrictor      = require('../../middleware/sessionRestrictor');
const login                  = require('../../database/user/login');
const tokenStore             = require('../../database/user/sessionTokenStore');
const logout                 = require('../../database/user/logout');
const auth                   = require('../../middleware/auth');
const deactiveAccount        = require('../../database/user/deactivateAccount');
const deactivatingFunction   = require('../../database/user/deactivatingFunction');
const resetPassword          = require('../../database/user/resetPasswordRequest');
const userValidation         = require('../../database/user/userValidator');
const resetPasswordFunction  = require('../../database/user/resetPasswordFunction');
const checkPassword          = require('../../database/user/checkPassword');
const changePassword         = require('../../database/user/changePasswordFunction');
const changeUserDetails      = require('../../database/user/changeUserDetails');
const changeEmail            = require('../../database/user/changeEmail');
const changeMobile           = require('../../database/user/changeMobile');


router.post('/registration', userRegistration.newUser, otpFetch.fetchOtp, emailOtp.sendOTP);
router.post('/verifyEmail', auth.authentication, verifyEmail.verifyEmail);
router.post('/verifyMobile', auth.authentication, verifyMobile.verifyMobile);
router.get('/resendEmailOtp', auth.authentication, otpFetch.fetchOtp, emailOtp.sendOTP);
router.post('/updateMobile', auth.authentication, updateMobile.changeMobile);
router.post('/updateEmail', auth.authentication, updateEmail.changeEmail);
router.get('/login', sessionRestrictor.sessionRestrictor, login.login, tokenStore.tokenStore);
router.get('/logout', auth.authentication, logout.logout);
router.get('/deactivate', auth.authentication, deactiveAccount.deactivate, deactivatingFunction.deactivatingFunction);
router.post('/resetPasswordRequest', userValidation.userValidator, resetPassword.resetPassword, otpFetch.fetchOtp, emailOtp.sendOTP);
router.post('/resetPassword', resetPasswordFunction.resetPasswordFunction);
router.post('/changePassword', auth.authentication, checkPassword.checkPassword, changePassword.changePassword);
router.post('/changeUserDetails', auth.authentication, checkPassword.checkPassword, changeUserDetails.changeUserDetails, tokenStore.tokenStore);
router.post('/changeEmail', auth.authentication, checkPassword.checkPassword, changeEmail.changeEmail, otpFetch.fetchOtp, emailOtp.sendOTP);
router.post('/changeMobile', auth.authentication, checkPassword.checkPassword, changeMobile.changeMobile);

router.post('/session', sessionRestrictor.sessionRestrictor);

module.exports = 
{
    router
}