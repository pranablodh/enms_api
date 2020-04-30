const express             = require('express');
const router              = express.Router();
const referralCode        = require('../../database/administrative/generateReferralCode');
const auth                = require('../../middleware/auth');
const getUserList         = require('../../database/administrative/getUserList');
const assignRole          = require('../../database/administrative/changeUserPrivilege');
const privilegeRestrcitor = require('../../middleware/adminPrivilegeRestrictor');
const deactivateAccount   = require('../../database/administrative/deactivateAccount');

router.get('/getCode', auth.authentication,  referralCode.storeCode);
router.get('/getUserList', auth.authentication,  getUserList.getUserList);
router.post('/changeRole', auth.authentication, privilegeRestrcitor.adminPrivilegeRestrictor, assignRole.changePrivilege);
router.post('/deactivateAccount', auth.authentication, privilegeRestrcitor.adminPrivilegeRestrictor, deactivateAccount.deactivateAccount);

module.exports = 
{
    router
}