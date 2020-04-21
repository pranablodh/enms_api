const express                = require('express');
const router                 = express.Router();
const userRegistration       = require('../../database/user/registration');
const otpFetch               = require('../../database/otp/otpFetch');
const emailOtp               = require('../../otp/emailOTP');
const otpSMS                 = require('../../otp/smsOTP');
const verifyEmail            = require('../../database/user/emailVerification');
const verifyMobile           = require('../../database/user/mobileVerification');
const sessionRestrictor      = require('../../middleware/sessionRestrictor');
const sessionList            = require('../../database/user/sessionList');
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
const destroyOtp             = require('../../database/otp/destroyOtp');
const getUserList            = require('../../database/superAdmin/getUserList');
const clearSession           = require('../../database/user/clearSession');


router.post('/registration', userRegistration.newUser);
router.post('/verifyEmail', auth.authentication, verifyEmail.verifyEmail, destroyOtp.destroyOtpEmail);
router.post('/verifyMobile', auth.authentication, verifyMobile.verifyMobile, destroyOtp.destroyOtpMobile);
router.get('/sendEmailOtp', auth.authentication, otpFetch.fetchOtp, emailOtp.sendOTP);
router.get('/sendSMSOtp', auth.authentication, otpFetch.fetchOtp, otpSMS.sendSMS);
router.get('/login', sessionRestrictor.sessionRestrictor, login.login, tokenStore.tokenStore);
router.delete('/logout', auth.authentication, logout.logout);
router.get('/deactivate', auth.authentication, deactiveAccount.deactivate, deactivatingFunction.deactivatingFunction);
router.post('/resetPasswordRequestMobile', userValidation.userValidator, resetPassword.resetPassword, otpFetch.fetchOtp, otpSMS.sendSMS);
router.post('/resetPasswordRequestEmail', userValidation.userValidator, resetPassword.resetPassword, otpFetch.fetchOtp, emailOtp.sendOTP);
router.post('/resetPassword', resetPasswordFunction.resetPasswordFunction, destroyOtp.destroyOtpBoth);
router.post('/changePassword', auth.authentication, checkPassword.checkPassword, changePassword.changePassword);
router.post('/changeUserDetails', auth.authentication, checkPassword.checkPassword, changeUserDetails.changeUserDetails, tokenStore.tokenStore);
router.post('/changeEmail', auth.authentication, checkPassword.checkPassword, changeEmail.changeEmail);
router.post('/changeMobile', auth.authentication, checkPassword.checkPassword, changeMobile.changeMobile);
router.get('/sessionList', sessionList.sessionList);
router.delete('/clearSession', clearSession.clearSession);

router.get('/list', getUserList.getUserList);

module.exports = 
{
    router
}