const express      = require('express');
const router       = express.Router();
const referralCode = require('../../database/referralCode/generateReferralCode');
const auth         = require('../../middleware/auth');
const getUserList  = require('../../database/admin/getUserList');

router.get('/getCode', auth.authentication,  referralCode.storeCode);
router.get('/getUserList', auth.authentication,  getUserList.getUserList);

module.exports = 
{
    router
}