const express      = require('express');
const router       = express.Router();
const referralCode = require('../../database/referralCode/generateReferralCode');
const auth         = require('../../middleware/auth');

router.get('/getCode', auth.authentication,  referralCode.storeCode);

module.exports = 
{
    router
}