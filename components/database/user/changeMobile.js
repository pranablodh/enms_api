const db             = require('../dbConnection/pgPool');
const otp            = require('../../otp/otpGenerator');
const inputValidator = require('../../inputValidator/inputValidator');
const token          = require('../../inputValidator/tokenGenerator');
const moment         = require('moment');
const dotenv         = require('dotenv');
dotenv.config();

const changeMobile = (req, response, next) =>
{
    if(!inputValidator.isValidMobileNumber(req.body.mobile)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid Mobile Number.'});
    }

    const createQuery = `WITH 
    upd1 AS(UPDATE user_verified SET mobile_verified = 0 WHERE uuid = $1),
    upd2 AS(UPDATE user_otp SET mobile_otp = $3 WHERE uuid = $1)
    UPDATE user_info SET contact_number = $2 WHERE uuid = $1 RETURNING *`

    const values = 
    [
        req.body.uuid,
        req.body.mobile,
        otp.otpGenerator(process.env.OTP_MAX_LENGTH)
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            db.pool.end;
            console.log(err);
            return response.status(400).send({'Message': 'Error.'});               
        }

        if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(404).send({'Message': 'User Not Found.'}); 
        }

        else if(res.rows.length > 0)
        {
            db.pool.end;  
            return response.status(202).send({'Message': 'Mobile Number Updated.'});
        }

        else
        {
            db.pool.end;
            console.log(err);
            return response.status(400).send({'Message': 'Mobile Number Not Updated.'}); 
        }
    });
}

module.exports = 
{
    changeMobile
}
