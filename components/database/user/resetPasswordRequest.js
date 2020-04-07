const db             = require('../dbConnection/pgPool');
const inputValidator = require('../../inputValidator/inputValidator');
const otp            = require('../../otp/otpGenerator');
const dotenv         = require('dotenv');
dotenv.config();

const resetPassword = (req, response, next) =>
{
    if(!req.body.user)
    {
        return response.status(400).send({'Message': 'Some Values Are Missing'});
    }

    if(!inputValidator.isValidEmail(req.body.user) & !inputValidator.isValidMobileNumber(req.body.user)) 
    {
        return response.status(400).send({'Message': 'Please Enter a Valid Email Address or Mobile Number'});
    }

    const createQuery = `INSERT INTO user_otp(uuid, email_otp, mobile_otp) VALUES((SELECT uuid
    FROM user_info WHERE contact_number = $1 OR email = $1), $2, $2)
    ON CONFLICT (uuid) DO UPDATE SET email_otp = EXCLUDED.email_otp, mobile_otp = EXCLUDED.mobile_otp RETURNING *`

    const values = 
    [
        req.body.user,
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

        else if(res.rows.length > 0)
        {
            db.pool.end;
            next();
        }

        else if(res.rows.length === 0)
        {
            db.pool.end;
            return response.status(400).send({'Message': 'User Not Registered.'});  
        }
    });
}

module.exports = 
{
    resetPassword
}