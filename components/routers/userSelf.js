const express = require('express');
const router = express.Router();
const userSelf = require('../database/userSelf');

router.post('/registration', userSelf.newUser);


module.exports = 
{
    router
}