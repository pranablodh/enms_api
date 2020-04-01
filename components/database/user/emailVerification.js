const db = require('../dbConnection/pgPool');

const verifyEmail = (req, response) =>
{
    const createQuery = `UPDATE user_verified SET email_verified = 1 FROM user_otp
    WHERE user_verified.uuid = user_otp.uuid AND user_otp.uuid = $1 AND user_otp.email_otp = $2 RETURNING *`

    const values = 
    [
        req.body.uuid,
        req.body.otp
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
            return response.status(404).send({'Message': 'Invalid OTP.'}); 
        }

        else
        {
            db.pool.end;
            return response.status(200).send({'Message': 'Email Verified.'});
        }
    });
}

module.exports = 
{
    verifyEmail
}