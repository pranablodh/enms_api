const db             = require('../dbConnection/pgPool');
const dotenv         = require('dotenv');
dotenv.config();

const fetchOtp = (req, response, next) =>
{
    const createQuery = `SELECT contact_number, email, email_otp, mobile_otp
    FROM user_info JOIN user_otp ON(user_info.uuid = user_otp.uuid)
    WHERE user_info.uuid = $1`

    const values = 
    [
        req.body.uuid,
    ];

    db.pool.query(createQuery, values, (err, res)=>
    {
        if(err)
        {
            console.log(err);
            db.pool.end;
            return response.status(400).send({'Message': 'Error'});               
        }

        if(res.rows.length === 0)
        {
            return response.status(404).send({'Message': 'User Not Found.'}); 
        }

        else
        {
            req.mobile      = res.rows[0].contact_number;
            req.email       = res.rows[0].email;
            req.email_otp   = res.rows[0].email_otp;
            req.mobile_otp  = res.rows[0].mobile_otp;
            next();
        }
    });
}

module.exports = 
{
    fetchOtp
}